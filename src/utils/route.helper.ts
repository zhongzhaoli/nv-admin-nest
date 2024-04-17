import { GetRouteToMetaDto } from '../route/dto/get-route.dto';
import { Route, RouteType } from '../route/route.entity';

export const routeTree = (item: GetRouteToMetaDto, allList: Route[]) => {
  const children = routeMap(allList).filter((v) => v.pid === item.id);
  if (children.length > 0) {
    item.children = children.map((v) => {
      return routeTree(v, allList);
    });
  } else {
    item.children = [];
  }
  return item;
};

export const routeMap = (list: Route[]): GetRouteToMetaDto[] => {
  return list.map((v) => {
    const { id, pid, component, name, path } = v;
    const dict: GetRouteToMetaDto = {
      id,
      pid,
      component,
      name,
      path,
      meta: {
        type: v.type,
        title: v.title,
        icon: v.icon,
        hidden: v.hidden,
        affix: v.affix,
        breadcrumbHidden: !v.breadcrumbHidden,
        keepAlive: v.keepAlive,
      },
    };
    if (v.type === RouteType.SINGLEMENU) {
      return singleRoute(dict);
    } else {
      return dict;
    }
  });
};

export const singleRoute = (item: GetRouteToMetaDto) => {
  return {
    path: '/',
    component: 'Layout',
    name: 'Root',
    redirect: item.path,
    children: [item],
    meta: {
      breadcrumbHidden: true,
    },
  };
};
