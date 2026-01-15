import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.NVIDIA_API_KEY;
        const baseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        // Add system message to enforce language matching and handle modes
        const lastMessage = messages[messages.length - 1]?.content || '';
        let systemContent = 'You are a helpful AI assistant. Always respond in the same language that the user is using. If the user writes in English, respond in English. If the user writes in another language, respond in that language. Match the user\'s language naturally.';
        
        if (lastMessage.startsWith('[Search Mode]')) {
            systemContent += ' The user has activated Search mode. Provide comprehensive, well-researched answers with factual information.';
        } else if (lastMessage.startsWith('[Study Mode]')) {
            systemContent += ' The user has activated Study mode. Explain concepts clearly, break down complex topics, and help them learn step by step.';
        }
        
        const messagesWithSystem = [
            {
                role: 'system',
                content: systemContent
            },
            ...messages
        ];

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-ai/deepseek-v3.2',
                messages: messagesWithSystem,
                temperature: 1,
                top_p: 0.95,
                max_tokens: 8192,
                stream: true,
                extra_body: { chat_template_kwargs: { thinking: true } },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            return NextResponse.json(
                { error: 'Failed to get AI response' },
                { status: response.status }
            );
        }

        // Create a TransformStream to process the SSE response
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                if (!reader) {
                    controller.close();
                    return;
                }

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') {
                                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                                    continue;
                                }

                                try {
                                    const parsed = JSON.parse(data);
                                    if (parsed.choices?.[0]?.delta?.content) {
                                        const content = parsed.choices[0].delta.content;
                                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                                    }
                                    // Handle reasoning content if present
                                    if (parsed.choices?.[0]?.delta?.reasoning_content) {
                                        const reasoning = parsed.choices[0].delta.reasoning_content;
                                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ reasoning })}\n\n`));
                                    }
                                } catch {
                                    // Skip invalid JSON
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Stream error:', error);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
