// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import updateNotifier from 'update-notifier';
import pkg from '../package.json';

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

  function parseOptions(): string[] {
    return Array.isArray(api.config.hint) ? api.config.hint : [];
  }

  api.onStart(() => {
    const pkgNames = parseOptions();
    const checkNames = [...new Set(pkgNames)];

    for (const pkgName of checkNames) {
      try {
        checkVersionNotify(pkgName);
      } catch {
        api.logger.error(
          `Check Update hint '${pkgName}' not exists，please check your config file :{ hint: ${JSON.stringify(
            api.config.hint,
          )} } `,
        );
      }
    }

    // check self
    updateNotifier({ pkg, shouldNotifyInNpmScript: true }).notify();
  });
}

export function checkVersionNotify(pkgName: string) {
  updateNotifier({
    pkg: require(`${pkgName}/package.json`),
    updateCheckInterval: 2 * 60 * 60 * 1000,
    shouldNotifyInNpmScript: true,
  }).notify({ defer: false });
}
