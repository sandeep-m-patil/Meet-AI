import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    return NextResponse.json({
        success: true,
        message: "API is working",
        timestamp: new Date().toISOString()
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        return NextResponse.json({
            success: true,
            message: "POST request received",
            data: body,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Failed to parse request body",
            timestamp: new Date().toISOString()
        }, { status: 400 });
    }
}
