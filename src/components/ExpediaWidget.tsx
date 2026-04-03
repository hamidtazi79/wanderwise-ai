'use client';

export default function ExpediaWidget() {
  return (
    <div className="w-full flex justify-center">
      <iframe
        src="https://creator.expediagroup.com/products/widgets/search?program=uk-expedia&network=pz&camref=1100l5Iqgj&lobs=stays,flights"
        width="100%"
        height="420"
        style={{ border: 'none', maxWidth: '575px' }}
        loading="lazy"
      />
    </div>
  );
}
