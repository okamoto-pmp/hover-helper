import { OpenAI } from "openai";

chrome.runtime.onMessage.addListener(async (request) => {
    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY!,
    });

    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);

    const url = tab.url;
    const regex = /https:\/\/dev\.to\/(.+)/;
    const match = url?.match(regex);
    if (!match) return;
    console.log(match);

    const key = match[1];
    const DEV_TO_API_KEY = import.meta.env.VITE_DEV_TO_API_KEY;

    const response = await fetch(`https://dev.to/api/articles/${key}`, {
        headers: {
            "api-key": DEV_TO_API_KEY,
        },
    });

    const article = await response.json();
    const content = article.body_markdown;
    const tabId = tab.id;

    const result = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `
                You are an AI assistant that helps users extract important proper nouns as keywords from articles and provides brief explanations for each keyword. 
                When a user provides an article, identify the key proper nouns (such as EC2, S3) that are significant in the context of the article. 
                Generate a JSON-formatted response with the following structure: {content:[{'keyword': xxx, 'summary': xxx}, ...]}.
                Just plain JSON-format, not make it markdown, cause I use your response as a JSON object in my code.
                `,
            },
            {
                role: "user",
                content: content,
            },
        ],
    });
    console.log(result);
    const resultJSON = result?.choices[0].message.content;
    if (!resultJSON) return;

    console.log(JSON.parse(resultJSON).content);
    const parsedResult = JSON.parse(resultJSON).content;

    if (request.action === "enqueue") {
        if (tabId) await queue(tabId, parsedResult);
    }
});

type GPTResponse = {
    content: {
        keyword: string;
        summary: string;
    }[];
};

const queue = async (tabId: number, resultJSON: GPTResponse) => {
    chrome.tabs.sendMessage(tabId, { action: "queueCompleted", resultJSON })
};