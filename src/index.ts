// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import updateNotifier from 'update-notifier';

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
    for (const pkgName of pkgNames) {
      try {
        updateNotifier({
          pkg: require(`${pkgName}/package.json`),
        }).notify();
      } catch {
        api.logger.error(
          `Update hint ${pkgName} not exists，please check your config[hint] `,
        );
      }
    }
  });
}
