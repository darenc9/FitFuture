import { Humanloop } from 'humanloop';

if (!process.env.HUMANLOOP_API_KEY) {
  throw new Error('No Humanloop API key provided');
}

const humanloop = new Humanloop({
  basePath: 'https://api.humanloop.com/v4',
  apiKey: process.env.HUMANLOOP_API_KEY,
});

export async function POST(req) {
  const messages = await req.json();
  
  const response = await humanloop.chatDeployed({
    project: 'Fitness',
    messages,
  });

  return new Response(JSON.stringify(response.data.data[0].output), {
    headers: { 'Content-Type': 'application/json' },
  });
}
