import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function ok<T>(data: T) {
  return NextResponse.json(data);
}

export function badRequest(message = 'Invalid request.') {
  return NextResponse.json({ status: 'invalid', message }, { status: 400 });
}

export function conflict(message: string) {
  return NextResponse.json({ status: 'exists', message }, { status: 409 });
}

export function serverError(error: unknown) {
  console.error(error);
  return NextResponse.json({ status: 'unknown' }, { status: 500 });
}

export function apiError(error: unknown) {
  if (error instanceof Response) return error;
  if (error instanceof ZodError) return badRequest(error.errors[0]?.message);
  return serverError(error);
}
