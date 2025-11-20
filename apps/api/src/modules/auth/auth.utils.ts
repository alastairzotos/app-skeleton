import { UnauthorizedException } from "@nestjs/common";
import { getSupabase } from "./supabase-admin";
import { Request } from "express";

export const addUserToRequest = async (request: Request) => {
  const authHeader = request.headers.authorization;
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    throw new UnauthorizedException('No token provided');
  }

  const supabase = getSupabase();
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new UnauthorizedException('Invalid or expired token');
  }

  (request as any).principal = user;

  return user;
};
