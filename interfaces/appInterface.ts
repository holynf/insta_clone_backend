export interface CustomErrorType extends Error {
    statusCode?: number;
    data?: any;
}
