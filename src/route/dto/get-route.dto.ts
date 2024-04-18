import { Route, RouteType } from '../route.entity';

export interface GetRouteDto {
  title?: string;
  path?: string;
}

export interface GetRouteToMetaDto extends Partial<Route> {
  meta: {
    title?: string;
    icon?: string;
    hidden?: boolean;
    affix?: boolean;
    breadcrumbHidden?: boolean;
    keepAlive?: boolean;
    type?: RouteType;
    sort?: number;
  };
  children?: GetRouteToMetaDto[];
}
