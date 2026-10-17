import path from 'node:path';
import fs from 'fs-extra';
import { CLIENT_LABEL_KEYS, englishLabels as en, pickClientLabels, resolveLabels } from '@/i18n/index.js';

describe('i18n client label subset', () => {
  const scriptsDir = path.resolve(process.cwd(), 'src/templates/scripts');

  /** Every `window.ReportUtils.t('…')` key referenced by the browser scripts. */
  const keysUsedByScripts = (): string[] => {
    const found = new Set<string>();
    for (const file of fs.readdirSync(scriptsDir).filter((f) => f.endsWith('.js'))) {
      const source = fs.readFileSync(path.join(scriptsDir, file), 'utf-8');
      for (const match of source.matchAll(/ReportUtils\.t\('([^']+)'/g)) {
        found.add(match[1]);
      }
    }
    return [...found].sort();
  };

  it('should cover every label key the browser scripts reference', () => {
    // Guards against a script picking up a new key without it being inlined
    // into the page, which would render the raw key to the user.
    const missing = keysUsedByScripts().filter((key) => !CLIENT_LABEL_KEYS.includes(key as never));
    expect(missing).toEqual([]);
  });

  it('should not inline keys the browser scripts never read', () => {
    const used = keysUsedByScripts();
    const unused = CLIENT_LABEL_KEYS.filter((key) => !used.includes(key));
    expect(unused).toEqual([]);
  });

  it('should resolve every client key against the English locale', () => {
    for (const key of CLIENT_LABEL_KEYS) {
      expect(en[key]).toBeDefined();
    }
  });

  it('should pick exactly the client subset and nothing more', () => {
    const picked = pickClientLabels(resolveLabels('pt-BR'));
    expect(Object.keys(picked).sort()).toEqual([...CLIENT_LABEL_KEYS].sort());
    expect(picked['status.passed']).toBe('Aprovado');
  });

  it('should keep inline-layout labels out of the inlined payload', () => {
    // Regression guard: shipping the full map placed '+ Show Info' into pages
    // rendered with the modal layout, which never display it.
    const picked = pickClientLabels(resolveLabels('en'));
    expect(JSON.stringify(picked)).not.toContain('+ Show Info');
  });
});
