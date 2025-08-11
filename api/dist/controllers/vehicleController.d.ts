import { Request, Response } from 'express';
export declare const vehicleController: {
    getAllVehicles(req: Request, res: Response): Promise<void>;
    getVehicleById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createVehicle(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateVehicle(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateVehicleStatus(req: Request, res: Response): Promise<void>;
    deleteVehicle(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=vehicleController.d.ts.map