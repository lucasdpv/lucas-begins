import { useEffect } from 'react';
import { cleanupDuplicates } from '../lib/CleanUp';
import { seedDatabase } from '../lib/SeedData';
import { STORAGE_KEYS, MIGRATION_VERSION } from '../constants';

/**
 * Componente responsável por rodar processos de inicialização do sistema,
 * como migrações de banco de dados e seed inicial.
 */
export default function SystemInitializer() {
  useEffect(() => {
    const lastMigration = localStorage.getItem(STORAGE_KEYS.MIGRATION_VERSION);

    const runInitialSetup = async () => {
      if (lastMigration !== MIGRATION_VERSION) {
        try {
          await cleanupDuplicates();
          await seedDatabase();
          localStorage.setItem(STORAGE_KEYS.MIGRATION_VERSION, MIGRATION_VERSION);
        } catch (error) {
          console.error("[SystemInitializer] Erro na inicialização:", error);
        }
      }
    };
    runInitialSetup();
  }, []);

  return null;
}
