import { Injectable } from '@nestjs/common';
import { GetRouteToMetaDto } from '../route/dto/get-route.dto';
import { Route, RouteType } from '../route/route.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface HaveChildrenRoute extends Route {
  children: GetRouteToMetaDto[];
}

export const routeTree = (
  item: Route,
  allList: Route[],
  isChildSet: Set<string>,
  needSingleMenu = false,
) => {
  const children = allList.filter((v) => v.pid === item.id);
  children.forEach((v) => isChildSet.add(v.id));
  if (children.length > 0) {
    item['children'] = children.map((v) => {
      return routeTree(v, allList, isChildSet, needSingleMenu);
    });
  } else {
    item['children'] = [];
  }
  return routeMap(item as HaveChildrenRoute);
};

export const routeMap = (
  obj: HaveChildrenRoute,
  needSingleMenu = false,
): GetRouteToMetaDto => {
  const { id, pid, component, name, path, children } = obj;
  const dict: GetRouteToMetaDto = {
    id,
    pid,
    component,
    name,
    path,
    children,
    meta: {
      type: obj.type,
      title: obj.title,
      icon: obj.icon,
      hidden: obj.hidden,
      affix: obj.affix,
      breadcrumbHidden: !obj.breadcrumbHidden,
      keepAlive: obj.keepAlive,
    },
  };
  if (needSingleMenu && obj.type === RouteType.SINGLEMENU) {
    return singleRoute(dict);
  } else {
    return dict;
  }
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
