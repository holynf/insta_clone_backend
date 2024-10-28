import { CustomErrorType } from "../interfaces/appInterface";

const ErrorValidationResult = ({ errorBody, code }: { errorBody: string; code: number }) => {
    const error: CustomErrorType = new Error(errorBody ?? "");
    error.statusCode = code ?? 404;
    throw error;
};
export default ErrorValidationResult;
