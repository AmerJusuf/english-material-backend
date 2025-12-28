import json
import os
from typing import Dict, List, Any, Tuple
from contextlib import contextmanager
import tiktoken

# Remove proxy environment variables BEFORE importing OpenAI
# These libraries may read proxy vars during import/initialization
proxy_vars_to_remove = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'ALL_PROXY', 'all_proxy']
for var in proxy_vars_to_remove:
    os.environ.pop(var, None)

# Import httpx and create a client without proxies BEFORE OpenAI imports it
import httpx

from openai import OpenAI
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
        
        # Check OpenAI API key
        openai_key = settings.OPENAI_API_KEY.strip() if settings.OPENAI_API_KEY else ''
        # Remove quotes if present (common mistake in env vars)
        openai_key = openai_key.strip('"').strip("'")
        
        # Debug: Check if key is being read (don't print full key for security)
        if openai_key:
            print(f"Info: OpenAI API key found (length: {len(openai_key)}, starts with: {openai_key[:7]}...)")
        else:
            print("Info: OpenAI API key is empty or not set")
        
        if openai_key and len(openai_key) > 10:  # Valid API keys are longer than 10 chars
            try:
                # Ensure proxy vars are removed
                proxy_vars_to_remove = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'ALL_PROXY', 'all_proxy']
                for var in proxy_vars_to_remove:
                    os.environ.pop(var, None)
                
                # Create a custom httpx client WITHOUT proxies and pass it to OpenAI
                # This prevents OpenAI from reading proxy env vars and passing them incorrectly
                custom_http_client = httpx.Client(
                    timeout=60.0,
                    # Explicitly don't set proxies - let httpx use None
                )
                
                self.openai_client = OpenAI(
                    api_key=openai_key,
                    http_client=custom_http_client
                )
                print("Success: OpenAI client initialized")
            except Exception as e:
                print(f"Warning: Failed to initialize OpenAI client: {e}")
                import traceback
                traceback.print_exc()
                self.openai_client = None
        else:
            if openai_key:
                print(f"Warning: OpenAI API key too short (length: {len(openai_key)})")
            else:
                print("Info: OpenAI API key not set or invalid")
    
    def count_tokens(self, text: str, model: str = "gpt-4o-mini") -> int:
        """Count tokens in text using tiktoken."""
        try:
            encoding = tiktoken.encoding_for_model(model)
        except KeyError:
            encoding = tiktoken.get_encoding("cl100k_base")
        return len(encoding.encode(text))
    
    def estimate_cost(self, prompt_tokens: int, completion_tokens: int, model: str) -> float:
        """Estimate cost based on token usage and model."""
        # Pricing as of 2024-2025 (per 1M tokens)
        pricing = {
            "gpt-4o-mini": {"input": 0.15, "output": 0.60},
            "gpt-4o": {"input": 2.50, "output": 10.00},
            "gpt-4-turbo": {"input": 10.00, "output": 30.00},
            "gpt-3.5-turbo": {"input": 0.50, "output": 1.50},
            "gpt-5": {"input": 5.00, "output": 15.00},  # Estimated pricing for GPT-5
        }
        
        if model not in pricing:
            model = "gpt-4o-mini"  # Default fallback
        
        input_cost = (prompt_tokens / 1_000_000) * pricing[model]["input"]
        output_cost = (completion_tokens / 1_000_000) * pricing[model]["output"]
        return input_cost + output_cost
    
    def get_pricing_info(self, model: str) -> Dict[str, float]:
        """Get pricing information for a model (per 1M tokens)."""
        pricing = {
            "gpt-4o-mini": {"input": 0.15, "output": 0.60},
            "gpt-4o": {"input": 2.50, "output": 10.00},
            "gpt-4-turbo": {"input": 10.00, "output": 30.00},
            "gpt-3.5-turbo": {"input": 0.50, "output": 1.50},
            "gpt-5": {"input": 5.00, "output": 15.00},
        }
        
        if model not in pricing:
            model = "gpt-4o-mini"
        
        return pricing[model]
    
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
        
        prompt = f"""You are an expert English language teacher creating a professional textbook chapter for B2-level students at a technical school training to become system administrators. The textbook should resemble the Oxford Solutions textbook family in design and methodology, combining explanatory texts, dialogues, and activities.

Create a complete textbook chapter for:

Chapter Title: {chapter_title}
{f"Additional Context: {chapter_description}" if chapter_description else ""}
{context}

CRITICAL FORMATTING INSTRUCTIONS:
- DO NOT use markdown symbols like #, ##, ###, **, *, etc.
- Write naturally as if typing in a Word document (.docx format)
- Students will fill out the textbook directly in Word, so include spaces for answers
- This is a TEXTBOOK (like Oxford Solutions), not just a workbook - include explanatory content, dialogues, and context

TARGET AUDIENCE:
- B2-level English students
- Technical school students training to become system administrators
- Content may connect to IT and technical professions
- Also include general, practical knowledge for workplace situations
- Language should balance formality and informality
- Not strictly IT-focused, but IT-aware

TEACHING PHILOSOPHY:
- Student-centered learning (support learning, not deliver lectures)
- Tasks designed for independent work, pairs, or groups
- Maximize student talking time
- Encourage students to use English as much as possible
- More demanding tasks should appear at the beginning or middle of the chapter
- Toward the end: focus on reflection, professional development, and contribution to class
- By the end, students should feel more confident in English skills and workplace knowledge

TIMING STRUCTURE:
- Each chapter fits within 5 lessons of 50 minutes each
- Structure activities to fit this timeframe
- Avoid repetition and overly complex exercises

CHAPTER STRUCTURE (follow this exact order):

1. INTRODUCTION
   - Brief introduction to the chapter topic
   - Connect to professional life and job applications
   - Set context for why this topic matters

2. WARM-UP ACTIVITY
   - Engaging activity to introduce the topic
   - Should activate prior knowledge
   - Can be done individually, in pairs, or groups
   - Designed to maximize student talking time

3. COMPREHENSIVE READING TEXT
   - A substantial reading text (200-300 words) related to the chapter topic
   - Should include practical information, examples, or scenarios
   - May include dialogues or conversations
   - Can relate to IT/technical professions but also general workplace situations
   - Include comprehension questions or tasks after the text

4. VOCABULARY SECTION
   - Key vocabulary relevant to the chapter topic
   - Include definitions and example sentences
   - Connect to IT/technical terms where appropriate
   - Include vocabulary exercises (matching, gap-filling, etc.)

5. SHORT GAMES AND INTERACTIVE TASKS
   - Include games like crosswords or matching tasks
   - Make them engaging and relevant to the topic
   - Can be completed individually or in pairs/groups

6. INTERESTING FACTS
   - Include 2-3 interesting facts related to the topic
   - Should be relevant to professional life or workplace situations
   - Can relate to IT/technical fields or general business practices

7. VARIED EXERCISES
   - Include different types: skeleton sentences, gap-filling, multiple choice, etc.
   - More demanding tasks should appear here (beginning/middle of chapter)
   - Exercises should allow students to practice independently or in pairs/groups
   - Include clear instructions and spaces for answers (use lines: _____)

8. GROUP WORK ACTIVITIES
   - Design tasks for group collaboration
   - Should encourage discussion and English use
   - Maximize student talking time
   - Can include problem-solving, case studies, or collaborative writing

9. DISCUSSION ACTIVITIES
   - Topics for class discussion related to the chapter
   - Should encourage students to express opinions and share experiences
   - Include discussion questions or prompts

10. ROLE-PLAY ACTIVITIES
    - Create realistic scenarios related to the chapter topic
    - Can involve job interviews, workplace conversations, professional meetings, etc.
    - Include clear roles and situations
    - Should be relevant to system administrators and general workplace situations

11. DIALOGUES
    - Include sample dialogues integrated into the content
    - Should demonstrate natural language use in professional contexts
    - Can be between colleagues, in interviews, or workplace situations
    - Include comprehension or practice tasks based on the dialogues

12. SUMMARY
    - Summarize key points from the chapter
    - Reinforce main learning objectives
    - Help students consolidate what they've learned

13. REFLECTION SECTION
    - Activities for students to reflect on their learning
    - Focus on professional development
    - Encourage students to think about their contribution to class activities
    - Should help students feel more confident in their English skills and workplace knowledge

FORMATTING GUIDELINES:
- Write all content as if it will be in a Word document (.docx)
- Use clear section headings (but NOT markdown)
- Include spaces for student answers (use underscores: _____)
- Number exercises clearly (1, 2, 3 or A, B, C)
- Write instructions in natural, clear language
- Include example answers or model responses where helpful
- Make the text visually structured but without markdown symbols

Remember: This is a professional textbook that combines explanatory content with activities. Students will fill it out directly in Word format. Avoid repetition and keep exercises appropriately complex for B2 level."""

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

