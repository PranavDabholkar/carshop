import { Request, Response } from 'express';
export declare const authController: {
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    logout(_req: Request, res: Response): Promise<void>;
    getCurrentUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
export default authController;
//# sourceMappingURL=authController.d.ts.map