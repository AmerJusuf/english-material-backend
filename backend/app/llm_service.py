import json
import os
from typing import Dict, List, Any, Tuple
from contextlib import contextmanager
import tiktoken
from openai import OpenAI
from anthropic import Anthropic
from app.config import get_settings

settings = get_settings()


@contextmanager
def no_proxy_env():
    """Temporarily remove proxy environment variables."""
    proxy_vars = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'ALL_PROXY', 'all_proxy']
    saved = {}
    for var in proxy_vars:
        if var in os.environ:
            saved[var] = os.environ.pop(var)
    try:
        yield
    finally:
        for var, value in saved.items():
            os.environ[var] = value


class LLMService:
    def __init__(self):
        # Only initialize clients if API keys are provided and not empty
        self.openai_client = None
        self.anthropic_client = None
        
        # Check OpenAI API key
        openai_key = settings.OPENAI_API_KEY.strip() if settings.OPENAI_API_KEY else ''
        # Remove quotes if present (common mistake in env vars)
        openai_key = openai_key.strip('"').strip("'")
        
        if openai_key and len(openai_key) > 10:  # Valid API keys are longer than 10 chars
            try:
                with no_proxy_env():
                    self.openai_client = OpenAI(api_key=openai_key)
            except Exception as e:
                print(f"Warning: Failed to initialize OpenAI client: {e}")
                self.openai_client = None
        else:
            print("Info: OpenAI API key not set or invalid")
        
        # Check Anthropic API key
        anthropic_key = settings.ANTHROPIC_API_KEY.strip() if settings.ANTHROPIC_API_KEY else ''
        # Remove quotes if present
        anthropic_key = anthropic_key.strip('"').strip("'")
        
        if anthropic_key and len(anthropic_key) > 10:
            try:
                with no_proxy_env():
                    self.anthropic_client = Anthropic(api_key=anthropic_key)
            except Exception as e:
                print(f"Warning: Failed to initialize Anthropic client: {e}")
                self.anthropic_client = None
        else:
            print("Info: Anthropic API key not set or invalid")
    
    def count_tokens(self, text: str, model: str = "gpt-4o-mini") -> int:
        """Count tokens in text using tiktoken."""
        try:
            encoding = tiktoken.encoding_for_model(model)
        except KeyError:
            encoding = tiktoken.get_encoding("cl100k_base")
        return len(encoding.encode(text))
    
    def estimate_cost(self, prompt_tokens: int, completion_tokens: int, model: str) -> float:
        """Estimate cost based on token usage and model."""
        # Pricing as of 2024 (per 1M tokens)
        pricing = {
            "gpt-4o-mini": {"input": 0.15, "output": 0.60},
            "gpt-4o": {"input": 2.50, "output": 10.00},
            "gpt-4-turbo": {"input": 10.00, "output": 30.00},
            "gpt-3.5-turbo": {"input": 0.50, "output": 1.50},
            "claude-3-5-sonnet-20241022": {"input": 3.00, "output": 15.00},
            "claude-3-opus": {"input": 15.00, "output": 75.00},
        }
        
        if model not in pricing:
            model = "gpt-4o-mini"  # Default fallback
        
        input_cost = (prompt_tokens / 1_000_000) * pricing[model]["input"]
        output_cost = (completion_tokens / 1_000_000) * pricing[model]["output"]
        return input_cost + output_cost
    
    def generate_chapter_content(
        self, 
        chapter_title: str, 
        chapter_description: str,
        previous_chapters: List[str],
        model: str = "gpt-4o-mini"
    ) -> Tuple[str, int, int]:
        """Generate content for a single chapter."""
        
        # Build context from previous chapters
        context = ""
        if previous_chapters:
            context = "\n\nPrevious chapters covered:\n" + "\n".join(previous_chapters)
        
        prompt = f"""You are an expert English language teacher creating modern, engaging learning materials.

Create comprehensive learning content for the following chapter:

Chapter Title: {chapter_title}
{f"Additional Context: {chapter_description}" if chapter_description else ""}
{context}

Generate a complete chapter with:
1. Introduction and learning objectives
2. 3-5 progressive learning tasks that build on each other
3. Each task should be modern, practical, and engaging
4. Include clear instructions for each task
5. Add vocabulary lists where relevant
6. Include examples and practice exercises
7. End with a summary and review questions

Format the output as a well-structured document with clear headings and sections.
Make it suitable for both classroom and self-study use."""

        if model.startswith("claude"):
            return self._generate_with_claude(prompt, model)
        else:
            return self._generate_with_openai(prompt, model)
    
    def _generate_with_openai(self, prompt: str, model: str) -> Tuple[str, int, int]:
        """Generate content using OpenAI API."""
        if not self.openai_client:
            raise ValueError(
                "OpenAI API key not configured. "
                "Please set OPENAI_API_KEY environment variable in Render dashboard."
            )
        
        response = self.openai_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are an expert English language teacher."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4000
        )
        
        content = response.choices[0].message.content
        prompt_tokens = response.usage.prompt_tokens
        completion_tokens = response.usage.completion_tokens
        
        return content, prompt_tokens, completion_tokens
    
    def _generate_with_claude(self, prompt: str, model: str) -> Tuple[str, int, int]:
        """Generate content using Anthropic Claude API."""
        if not self.anthropic_client:
            raise ValueError(
                "Anthropic API key not configured. "
                "Please set ANTHROPIC_API_KEY environment variable in Render dashboard."
            )
        
        message = self.anthropic_client.messages.create(
            model=model,
            max_tokens=4000,
            temperature=0.7,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        content = message.content[0].text
        prompt_tokens = message.usage.input_tokens
        completion_tokens = message.usage.output_tokens
        
        return content, prompt_tokens, completion_tokens
    
    def generate_material(
        self, 
        title: str, 
        chapters: List[Dict[str, str]], 
        model: str = "gpt-4o-mini"
    ) -> Tuple[Dict[str, Any], int, int]:
        """Generate complete material with all chapters."""
        
        result = {
            "title": title,
            "chapters": []
        }
        
        total_prompt_tokens = 0
        total_completion_tokens = 0
        previous_chapters = []
        
        for i, chapter in enumerate(chapters, 1):
            chapter_title = chapter.get("title", f"Chapter {i}")
            chapter_description = chapter.get("description", "")
            
            content, prompt_tokens, completion_tokens = self.generate_chapter_content(
                chapter_title,
                chapter_description,
                previous_chapters,
                model
            )
            
            result["chapters"].append({
                "number": i,
                "title": chapter_title,
                "content": content
            })
            
            total_prompt_tokens += prompt_tokens
            total_completion_tokens += completion_tokens
            previous_chapters.append(chapter_title)
        
        return result, total_prompt_tokens, total_completion_tokens


# Singleton instance
llm_service = LLMService()

