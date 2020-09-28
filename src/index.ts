// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import updateNotifier, { Package } from 'update-notifier';
import pkg from '../package.json';

export const DIR_NAME = 'plugin-hint';

export default function(api: IApi) {
  api.describe({
    key: 'hint',
    config: {
      schema(joi) {
        return joi.array();
      },
    },
    enableBy: api.EnableBy.config,
  });

  function getCheckPackages(): Package[] {
    // add self
    const pkgNames: string[] = [
      ...new Set([...(api.config.hint || []), pkg.name]),
    ];

    // @ts-ignore
    return pkgNames
      .map(name => {
        try {
          return api.utils.lodash.pick(require(`${name}/package.json`), [
            'version',
            'name',
          ]) as Package;
        } catch (e) {
          console.error(e);
          api.logger.error(
            `Check Update hint '${name}' not exists，please check your config file :{ hint: ${JSON.stringify(
              api.config.hint,
            )} } `,
          );
        }
        return null;
      })
      .filter(v => !!v);
  }

  // 获取打印内容
  function getPrintLogContent(
    key: string,
    value: string,
    valueBkColor?: string,
  ) {
    const commonCss = 'color:#fff;padding:2px;';
    const leftCss = commonCss + 'border-radius:2px 0 0 2px;';
    const rightCss = commonCss + 'border-radius:0 2px 2px 0;';
    return `console.log('%c ${key} '+'%c ${value} ', 'background:#606060;${leftCss}','background:${valueBkColor ||
      '#1275B2'};${rightCss}')`;
  }

  api.onStart(() => {
    const packages = getCheckPackages();
    packages.forEach(checkVersionNotify);
  });

  // print build info
  api.addHTMLHeadScripts(() => {
    const envColor = {
      production: '',
      development: '#9400D3',
      test: '#FFA500',
    };
    return [
      // build info
      {
        content: getPrintLogContent(
          'Environment',
          api.env as string,
          envColor[api.env as string],
        ),
      },
      {
        content: getPrintLogContent('Version', api.pkg.version),
      },
      {
        content: getPrintLogContent('Build Date', new Date().toString()),
      },
      // print dependencies package build version
      {
        content: getCheckPackages()
          .map(({ name, version }) => getPrintLogContent(name, version))
          .join(';'),
      },
    ];
  });

  // export build info for runtime
  api.onGenerateFiles(() => {
    const packages = getCheckPackages();

    api.writeTmpFile({
      path: `${DIR_NAME}/buildInfo.ts`,
      content: `
      export const buildInfo = {
        version: '${api.pkg.version}',
        buildDate: '${Date.now()}',
        dependencies: ${JSON.stringify(packages, null, 2)}
      }
      `,
    });
  });

  api.addRuntimePlugin(() => `@@/${DIR_NAME}/buildInfo`);
}

export function checkVersionNotify(pkg: Package) {
  updateNotifier({
    pkg,
    updateCheckInterval: 0,
    shouldNotifyInNpmScript: true,
  }).notify({ defer: false });
}
