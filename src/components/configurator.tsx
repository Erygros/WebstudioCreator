'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import type { Configuration } from '@/lib/pricing';
import { getProduct, PRICE_VERSION } from '@/lib/catalog';
import { money, type Locale } from '@/lib/i18n';
import { QuoteSummary } from './forms';
export function Configurator({ locale, productId }: { locale: Locale; productId: string }) {
  const de = locale === 'de';
  const product = getProduct(productId)!;
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const router = useRouter();
  const config: Configuration = { productId, quantities, priceVersion: PRICE_VERSION };
  function start() {
    try {
      sessionStorage.setItem('wc-config', JSON.stringify(config));
    } catch {}
    router.push(`/${locale}/order?product=${productId}`);
  }
  return (
    <div className="wizard-layout">
      <div>
        <h3 style={{ marginBottom: 15 }}>{de ? 'Was passt zu dir?' : 'What works for you?'}</h3>
        {product.options.map((o) => (
          <div className="config-option" key={o.id}>
            <label>
              {o.max === 1 && (
                <input
                  type="checkbox"
                  checked={!!quantities[o.id]}
                  onChange={(e) =>
                    setQuantities((q) => ({ ...q, [o.id]: e.target.checked ? 1 : 0 }))
                  }
                />
              )}
              <span>
                {o.name[locale]}
                <small>
                  + {money(o.price, locale)}
                  {o.period === 'monthly' && (de ? ' / Monat' : ' / month')}
                  {o.max > 1 && (de ? ' je Einheit' : ' per unit')}
                </small>
              </span>
            </label>
            {o.max > 1 && (
              <div className="quantity">
                <button
                  type="button"
                  aria-label={`${o.name[locale]} −1`}
                  disabled={!quantities[o.id]}
                  onClick={() => setQuantities((q) => ({ ...q, [o.id]: (q[o.id] || 0) - 1 }))}
                >
                  <Minus size={12} />
                </button>
                <span aria-live="polite">{quantities[o.id] || 0}</span>
                <button
                  type="button"
                  aria-label={`${o.name[locale]} +1`}
                  disabled={(quantities[o.id] || 0) >= o.max}
                  onClick={() => setQuantities((q) => ({ ...q, [o.id]: (q[o.id] || 0) + 1 }))}
                >
                  <Plus size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
        <button className="button" style={{ marginTop: 30 }} onClick={start}>
          {product.comingSoon
            ? de
              ? 'Zur unverbindlichen Vormerkung'
              : 'Continue to interest form'
            : de
              ? 'Mit dieser Auswahl anfragen'
              : 'Enquire with this configuration'}
          <ArrowUpRight size={16} />
        </button>
      </div>
      <QuoteSummary locale={locale} config={config} />
    </div>
  );
}
