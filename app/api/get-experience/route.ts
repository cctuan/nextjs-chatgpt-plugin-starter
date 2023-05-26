import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('body: ', body)
  const responseRaw = await fetch(`https://travel.line.me/public/content-api/pois/autoComplete?keyword=${body.keyword}`)
  const response = await responseRaw.json()
  console.log(response)
  if (response.pageProps.isError || response.pageProps?.serverSideData?.items) {
    return NextResponse.json(
      {
        experiences: [],
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "https://chat.openai.com",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, openai-ephemeral-user-id, openai-conversation-id",
        },
      }
    )
  }
  const experiences = response.pageProps.serverSideData.items.map((experience: any) => {
    return {
      url: `https://travel.line.me/tp?data=${experience.hashedDeeplink}`,
      price: experience.price,
      name: experience.name,
      rating: experience.rating,
      cities: experience.cities,
    }
  }).slice(0, 8)
  return NextResponse.json(
    {
      experiences: experiences,
    },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://chat.openai.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, openai-ephemeral-user-id, openai-conversation-id",
      },
    }
  );
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://chat.openai.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, openai-ephemeral-user-id, openai-conversation-id",
      },
    }
  );
}
