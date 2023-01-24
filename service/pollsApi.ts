import { SERVER_URL } from "../constants";
import ApiBase, { Methods } from "./api-base";

const Items = {
  polling_unit: 'polling_unit',
  lga: 'lga',
  announced_pu_results: 'announced_pu_results',
  ward: 'ward'
}


type ModelName = keyof typeof Items;


export interface PollsAppResponse<T> {
  type: string;
  message: string;
  data: T;

}

export interface PagenatedRequest {
  modelName: ModelName;
  extras?: string[];
  crieteria?: any;
  limit?: number;
  page?: number;
}

export interface ViewRequest {
  modelName: ModelName;
  modelId: number;
  populate?: string;

}

export interface CreateRequest {
  modelName: ModelName;
  payload: any;
}

export interface UpdateRequest {
  modelName: ModelName;
  where: Record<string, any>;
  update: Record<string, any>;
}

export interface PagenatedResponse<T> {
  payload: T[];
  rows: number;
  page: number;
  total: number;
}

export class PollsAppApi extends ApiBase {
  private static _instance: PollsAppApi;

  public getModelList<T>(req: PagenatedRequest) {
    const { modelName,  crieteria, limit = 50, page = 1 } = req;
    const params = {
   
      page,
      limit,
      ...crieteria,
    };
    return this.createGenericFetch<
      PollsAppResponse<{
        payload: Array<T>;
        rows: number;
        page: number;
        total: number;
        size: number;
      }>,
      any
    >(`/get-items`, Methods.GET)(params, {}, {}, [modelName]);
  }



  public createPu<T>(req: CreateRequest) {
    const { payload } = req;

    return this.createGenericFetch<
  {
        success: boolean;
        data: T;
      },
      any
    >("/create-polling-unit", Methods.POST)({}, {}, payload);
  }

  public getPollingUnitResults<T>(req: PagenatedRequest) {
    const { modelName,  crieteria, limit = 50, page = 1, extras } = req;
    const params = {
   
      page,
      limit,
      ...crieteria,
    };
    return this.createGenericFetch<
      PollsAppResponse<{
        payload: Array<T>;
        rows: number;
        page: number;
        total: number;
        size: number;
      }>,
      any
    >(`/get-results-for-polling-unit`, Methods.GET)(params, {}, {}, [...(extras || [])]);
  }




  public static get Instance() {
    return (
      this._instance ||
      (this._instance = new PollsAppApi(SERVER_URL))
    );
  }
  public resetAppState() {
    this.setToken("");
  }
}

export default PollsAppApi.Instance;
