import { Request, Response } from 'express';
export declare const serviceController: {
    getAllServices(req: Request, res: Response): Promise<void>;
    getServiceById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createService(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateService(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteService(req: Request, res: Response): Promise<void>;
    updateServiceStatus(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=serviceController.d.ts.map