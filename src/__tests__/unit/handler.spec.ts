import ErrorHandler from '../../core/errors/handler';

describe('Testing error handling functions', () => {
    test('expect return error calling Handler', () => {
        expect.assertions(1);

        expect(() => {
            throw new ErrorHandler('handling error for testing purpouses', 404);
        }).toThrow('handling error for testing purpouses');
    });

    test('expect return error message when call ErrorHandler.getMessage()', () => {
        expect.assertions(1);

        const error = new ErrorHandler('getting error message', 409);
        expect(error.getMessage()).toEqual('getting error message');
    });

    test('expect return error status_code when call ErrorHandler.getStatusCode()', () => {
        expect.assertions(1);

        const error = new ErrorHandler('getting status_code', 400);
        expect(error.getStatusCode()).toEqual(400);
    });

    test('expect return error other errors when call ErrorHandler.getErrors()', () => {
        expect.assertions(1);

        const error = new ErrorHandler('getting other errors', 422);
        error.setErrors(['Unexpected token } in JSON at position 2022']);
        expect(error.getErrors()).toEqual([
            'Unexpected token } in JSON at position 2022',
        ]);
    });

    test('expect return error other errors when call ErrorHandler.getErrors()', () => {
        const error = new ErrorHandler(
            // @ts-ignore
            { name: 'test', message: 'testing' },
            422
        ).setErrors([{ name: 'test', message: 'testing' }]);

        expect(error.name).toEqual('Error');
        expect(error.message).toEqual('[test] testing');
        expect(error.getErrors().length).toBe(1);
        expect.assertions(3);
    });

    test('expect return message format does not supported when call ErrorHandler', () => {
        // @ts-ignore
        const error = new ErrorHandler(Number(30), 422);

        expect(String(error)).toBe('Error: message format does not supported');
        expect.assertions(1);
    });
});
