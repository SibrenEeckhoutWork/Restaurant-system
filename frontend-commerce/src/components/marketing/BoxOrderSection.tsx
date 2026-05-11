'use client';

import { useState } from 'react';

interface AccessoryProduct { id: string; name: string; price: number }
interface BoxProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  accessories: AccessoryProduct[];
}

interface Props {
  boxes: BoxProduct[];
}

type Step = 'boxes' | 'details' | 'success';

function formatPrice(price: number) {
  return `€ ${Number(price).toFixed(2).replace('.', ',')}`;
}

export default function BoxOrderSection({ boxes }: Props) {
  const [open, setOpen] = useState(false);
  const [initialId, setInitialId] = useState<string | null>(null);

  function openModal(boxId: string) {
    setInitialId(boxId);
    setOpen(true);
  }

  return (
    <>
      <div className="boxes">
        {boxes.map((box, idx) => (
          <article key={box.id} className="box-card">
            {idx === 1 && <div className="box-card__ribbon">Meest gekozen</div>}
            <div className="box-card__photo">
              <div className="ph"><span>{box.name}</span></div>
            </div>
            <div className="box-card__body">
              <div className="box-card__head">
                <h3>{box.name}</h3>
                <span className="box-card__price">{formatPrice(box.price)} p.p.</span>
              </div>
              {box.description && <span className="box-card__feeds">{box.description}</span>}
              {box.accessories.length > 0 && (
                <ul>
                  {box.accessories.map((a) => <li key={a.id}>{a.name}</li>)}
                </ul>
              )}
              <button
                className={`btn ${idx === 1 ? 'btn--jam' : 'btn--ghost'}`}
                onClick={() => openModal(box.id)}
              >
                Kies deze <span className="arrow">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {open && (
        <OrderModal
          boxes={boxes}
          initialBoxId={initialId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

/* ─── Modal ─────────────────────────────────────────────────────────────── */

interface ModalProps {
  boxes: BoxProduct[];
  initialBoxId: string | null;
  onClose: () => void;
}

function OrderModal({ boxes, initialBoxId, onClose }: ModalProps) {
  const initQty = Object.fromEntries(
    boxes.map((b) => [b.id, b.id === initialBoxId ? 1 : 0]),
  );

  const [step, setStep]     = useState<Step>('boxes');
  const [qty, setQty]       = useState<Record<string, number>>(initQty);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    deliveryType: 'pickup' as 'delivery' | 'pickup',
    address: '',
    notes: '',
  });

  const selectedItems = boxes.filter((b) => (qty[b.id] ?? 0) > 0);
  const total = selectedItems.reduce((s, b) => s + b.price * qty[b.id], 0);

  function adjust(id: string, delta: number) {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const items = selectedItems.map((b) => ({
        productId: b.id,
        quantity: qty[b.id],
      }));
      const body = {
        ...form,
        address: form.deliveryType === 'delivery' ? form.address : undefined,
        items,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Bestelling mislukt. Probeer opnieuw.');
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onverwachte fout.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="omodal-backdrop" onClick={onClose}>
      <div className="omodal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="omodal__header">
          <div style={{ flex: 1 }}>
            {step !== 'success' && (
              <>
                {/* Step indicator */}
                <div className="omodal__steps">
                  <div className={`omodal__step-dot ${step === 'boxes' ? 'is-active' : 'is-done'}`}>
                    {step !== 'boxes' ? '✓' : '1'}
                  </div>
                  <div className="omodal__step-line" />
                  <div className={`omodal__step-dot ${step === 'details' ? 'is-active' : step === 'success' ? 'is-done' : ''}`}>
                    2
                  </div>
                </div>
                <span className="eyebrow" style={{ display: 'block', marginTop: '0.75rem' }}>
                  {step === 'boxes' ? 'Jouw bestelling' : 'Jouw gegevens'}
                </span>
              </>
            )}
          </div>
          <button className="omodal__close" onClick={onClose} aria-label="Sluiten">✕</button>
        </div>

        {/* Step 1 — box selection */}
        {step === 'boxes' && (
          <div className="omodal__body">
            <div className="omodal__box-list">
              {boxes.map((box) => (
                <div key={box.id} className="omodal__box-row">
                  <div className="omodal__box-info">
                    <span className="omodal__box-name">{box.name}</span>
                    <span className="box-card__price" style={{ fontSize: '0.85rem' }}>
                      {formatPrice(box.price)} p.p.
                    </span>
                  </div>
                  <div className="omodal__qty">
                    <button
                      className="omodal__qty-btn"
                      onClick={() => adjust(box.id, -1)}
                      disabled={!qty[box.id]}
                    >−</button>
                    <span className="omodal__qty-val">{qty[box.id] ?? 0}</span>
                    <button
                      className="omodal__qty-btn"
                      onClick={() => adjust(box.id, 1)}
                    >+</button>
                  </div>
                </div>
              ))}
            </div>

            {selectedItems.length > 0 && (
              <div className="omodal__total">
                <span className="eyebrow">Totaal</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem' }}>
                  {formatPrice(total)}
                </span>
              </div>
            )}

            <div className="omodal__actions">
              <button
                className="btn btn--jam btn--lg"
                onClick={() => setStep('details')}
                disabled={selectedItems.length === 0}
              >
                Volgende <span className="arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — contact details */}
        {step === 'details' && (
          <form className="omodal__body" onSubmit={submit}>
            <div className="omodal__form-grid">
              <label className="omodal__label">
                Naam *
                <input
                  className="omodal__input"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
                />
              </label>
              <label className="omodal__label">
                E-mail *
                <input
                  className="omodal__input"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </label>
              <label className="omodal__label">
                Telefoon *
                <input
                  className="omodal__input"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </label>

              <div className="omodal__label" style={{ gridColumn: '1 / -1' }}>
                Levering
                <div className="omodal__toggle">
                  <button
                    type="button"
                    className={`omodal__toggle-btn ${form.deliveryType === 'pickup' ? 'is-active' : ''}`}
                    onClick={() => setForm((p) => ({ ...p, deliveryType: 'pickup' }))}
                  >Afhaling</button>
                  <button
                    type="button"
                    className={`omodal__toggle-btn ${form.deliveryType === 'delivery' ? 'is-active' : ''}`}
                    onClick={() => setForm((p) => ({ ...p, deliveryType: 'delivery' }))}
                  >Levering aan huis</button>
                </div>
              </div>

              {form.deliveryType === 'delivery' && (
                <label className="omodal__label" style={{ gridColumn: '1 / -1' }}>
                  Adres *
                  <input
                    className="omodal__input"
                    required
                    placeholder="Straat, nr, gemeente"
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </label>
              )}

              <label className="omodal__label" style={{ gridColumn: '1 / -1' }}>
                Opmerkingen
                <textarea
                  className="omodal__input"
                  rows={3}
                  placeholder="Allergieën, leveringstijd, …"
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                />
              </label>
            </div>

            {error && (
              <p style={{ color: 'var(--jam)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>
            )}

            <div className="omodal__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setStep('boxes')}
              >← Terug</button>
              <button
                type="submit"
                className="btn btn--jam btn--lg"
                disabled={loading}
              >
                {loading ? 'Bezig…' : <>Bestellen <span className="arrow">→</span></>}
              </button>
            </div>
          </form>
        )}

        {/* Step 3 — success */}
        {step === 'success' && (
          <div className="omodal__body omodal__success">
            <div className="omodal__success-mark">✓</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Bedankt!</h3>
            <p style={{ color: 'var(--espresso-2)' }}>
              Jouw bestelling is ontvangen. We nemen zo snel mogelijk contact op via {form.email}.
            </p>
            <button className="btn btn--ghost" style={{ marginTop: '1.5rem' }} onClick={onClose}>
              Sluiten
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
