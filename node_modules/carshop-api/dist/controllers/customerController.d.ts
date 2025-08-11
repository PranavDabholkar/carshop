import { Request, Response } from 'express';
export declare const customerController: {
    getAllCustomers(req: Request, res: Response): Promise<void>;
    getCustomerById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createCustomer(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateCustomer(req: Request, res: Response): Promise<void>;
    deleteCustomer(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=customerController.d.ts.map