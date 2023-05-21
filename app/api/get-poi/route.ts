import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('body: ', body)
  const responseRaw = await fetch(`https://travel.line.me/public/content-api/pois/autoComplete?keyword=${body.keyword}`)
  const response = await responseRaw.json()
  console.log(response)
  const pois = response.data.items.map((poi: any) => {
    return {
      poiURL: `https://travel.line.me/poi/${poi.poiId}`,
      coverPhoto: poi.coverPhoto,
      name: poi.name,
      nickname: poi.nickname
    }
  }).slice(0, 5)
  return NextResponse.json(
    {
      pois: pois,
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
