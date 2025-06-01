import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';

export const getTypeOrmModuleOptions = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  ...dbSelector(config),
  autoLoadEntities: true,
  synchronize: false,
});

export const dbSelector = (config: ConfigService) => {
  const dbLocation = config.getDatabaseUrl();

  const selector = {
    sqlite: { type: 'sqlite', database: dbLocation },
    postgres: { type: 'postgres', url: dbLocation },
    default: { type: null },
  };

  return selector[config.getDatabaseType() || 'default'];
};
