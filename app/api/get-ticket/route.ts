import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('body: ', body)
  const ticketSearch = {
    "page":1,
    "pageSize":30,
    "airlines":[],
    "roundType":1,
    "numOfAdult":body.numOfAdult,
    "numOfChildren":0,
    "numOfBaby":0,
    "cabinClass":1,
    "linePointsRebateOnly":true,
    "flightSegments":[
      {"departDate":body.startDate,"fromCity":body.fromCity,"toCity":body.toCity},
      {"departDate":body.backDate,"fromCity":body.toCity,"toCity": body.fromCity}
    ]
  }
  const responseRaw = await fetch(`https://travel.line.me/content-api/flights/tickets:search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "origin": "https://travel.line.me",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    },
    body: JSON.stringify(ticketSearch)
  })
  const response = await responseRaw.json()
  console.log(response)
  if (!response.data || !response.data.items || response.data.items.length < 1) {
    return NextResponse.json(
      {
        tickets: [],
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
  const tickets = response.data.items.map((ticket: any) => {
    return {
      agentName: ticket.agentName,
      arriveAirport: ticket.arriveAirport,
      arriveTime: ticket.arriveTime,
      departTime: ticket.departTime,
      returnArriveTime: ticket.returnArriveTime,
      returnDepartTime: ticket.returnDepartTime,
      departAirport: ticket.departAirport,
      price: ticket.totalFare,
    }
  }).slice(0, 8)
  return NextResponse.json(
    {
      tickets: tickets,
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
