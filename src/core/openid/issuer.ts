import { IIssuer, IWellKnow } from '../../interfaces/issuer';
import Request from '../../providers/request';
import { DISCOVER } from './endpoints.json';

class Issuer implements IIssuer {
    constructor(protected issuer: string) {}

    /**
     * init: Return an instance of Issuer class.
     * @param issuer string
     * @returns new Issuer
     */
    static init(issuer: string) {
        return new this(issuer);
    }

    /**
     * discover: Return endpoints and oAuth informations.
     * @returns Promise<IWellKnow>
     */
    async discover(): Promise<IWellKnow> {
        try {
            const { data: issuerResponse } = await Request.init(
                this.issuer
            ).request<unknown, IWellKnow>('GET', DISCOVER);

            return issuerResponse;
        } catch (err) {
            throw err.response.data;
        }
    }
}

export default Issuer;
