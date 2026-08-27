export function getErrorMessage(err) {
    if (err instanceof Error) {
        return err.message;
    }
    return String(err);
}
//# sourceMappingURL=getErrorMessage.js.map