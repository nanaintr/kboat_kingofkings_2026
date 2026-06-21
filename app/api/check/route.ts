import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

function maskName(name: string) {
  if (!name) return "";
  return name[0] + "*".repeat(Math.max(name.length - 1, 1));
}

function maskPhone(phone: string) {
  const digits = normalizePhone(phone);
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-****`;
  }
  return digits.slice(0, -4) + "****";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = normalizePhone(body.phone || "");

    if (!/^010\d{8}$/.test(phone)) {
      return NextResponse.json(
        { error: "휴대전화번호 11자리를 정확히 입력해주세요." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("winners")
      .select("name, phone, coupon_amount")
      .eq("phone", phone)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: "조회 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ won: false });
    }

    return NextResponse.json({
      won: true,
      nameMasked: maskName(data.name),
      phoneMasked: maskPhone(data.phone),
      amount: Number(data.coupon_amount).toLocaleString("ko-KR") + "원",
    });
  } catch {
    return NextResponse.json(
      { error: "요청을 처리할 수 없습니다." },
      { status: 500 }
    );
  }
}