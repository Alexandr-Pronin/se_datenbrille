import User from "../entities/user";
import { Request as ExpressRequest, Response } from "express";

export default interface Request extends ExpressRequest {
    user?: User;
}