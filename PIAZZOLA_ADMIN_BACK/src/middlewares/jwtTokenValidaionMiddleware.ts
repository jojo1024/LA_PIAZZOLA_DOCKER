import { NextFunction, Request, Response } from "express";
import axios, { AxiosResponse } from "axios";

export const verifyGlobalApiToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers["authorization"]; //if authorization exist in header
        if (!authHeader) throw { name: 'TOKEN_REQUIRED', message: "authorization header is required!" };

        const response: AxiosResponse = await axios.get(
            `${process.env.GLOBAL_API_BASE_URL}/auth/checktoken`,
            {
                headers: {
                    Authorization: `Bearer ${authHeader.replace("Bearer ", "")}`,
                },
            }
        );
        console.log("🚀 ~ verifyGlobalApiToken ~ response:", response.data);

        if (response.data.error) throw response.data.error;

        next();
    } catch (error) {
        console.log("error:", error);
        res.send({ status: 0, error });
    }
};
