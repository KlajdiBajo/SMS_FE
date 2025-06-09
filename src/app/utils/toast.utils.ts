export function getToastMessage(error: any, defaultMessage?: string): string {

    if (error && error.status && Array.isArray(error.status) && error.status.length > 0) {
        const err = error.status[0];
        if (err.message && err.action) {
            return `${err.message} ${err.action}`;
        } else if (err.message) {
            return err.message;
        } else if (err.action) {
            return err.action;
        }
    }

    if (defaultMessage) {
        return defaultMessage;
    }

    return 'Unexpected error occurred.';
} 