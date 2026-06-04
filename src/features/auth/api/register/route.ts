import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { withRateLimit, RateLimitPresets } from "@/lib/middleware/rate-limit"
import { registerSchema } from "@/features/auth/lib/auth.schema"
import { serializeError, ValidationError, ValidationErrorCode } from "@/lib/errors"
import { validate } from "@/lib/validation/validators"
import { logErrorWithStrategy } from "@/lib/logger/server"

export async function registerHandler(request: Request) {
  try {
    const body = validate(registerSchema, await request.json())
    const { name, email, password } = body

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      const error = new ValidationError(
        "User with this email already exists",
        ValidationErrorCode.BUSINESS_RULE_VIOLATION,
        { statusCode: 409, context: { email } }
      )

      return NextResponse.json(
        { error: serializeError(error, false) },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    logErrorWithStrategy(error, { action: "register" })

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: serializeError(error, false) },
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(RateLimitPresets.AUTH, registerHandler)
