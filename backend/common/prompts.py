chunk_summary_prompt = """ You are generating a brief summary of a document chunk.
                        Requirements:
                        - Return ONLY HTML no markdown, no JSON
                        - Keep the summary extremely concise maximum of 20-30 words
                        - Use <p> only (no headings, no lists)
                        - Avoid repeating phrases from the text
                        - Focus ONLY on key ideas, not details """

final_summary_prompt = """  You are generating a short, high level summary of an entire document.
                        Requirements:
                        - Return ONLY HTML (no <html> or <body> tags)
                        - Output "ONE SINGLE SECTION ONLY"
                        - Use clean HTML elements:
                            <h2>, <p>, <ul>, <li>, <strong>, <em>
                        - Keep the summary concise, no more than 4 to 6 sentences
                        - Focus only on the core idea and key purpose of the document
                        - Avoid unnecessary detail or subtopics
                        - Do NOT reference chunk summaries or analysis steps """

classify_prompt = """ Classify the entire document into the most appropriate category.
                        Your task is to classify the document summary into:
                        1. A CATEGORY (broader domain)
                        2. A SUBCATEGORY (more specific)
                        3. A CONFIDENCE score from 0 to 1
                        Choose the CATEGORY ONLY from this list:
                        - finance
                        - education
                        - medical
                        - legal
                        - technical
                        - business
                        - personal
                        - creative
                        - other
                        Return ONLY HTML with the following structure:
                        <h2>Classification</h2>
                        <p><strong>Category:</strong> {category}</p>
                        <p><strong>Reasoning:</strong> {one-sentence explanation}</p>
                        SUMMARY TO CLASSIFY: """