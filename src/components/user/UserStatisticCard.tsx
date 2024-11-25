type UserStatisticCardProps = {
  amount: number;
  label: string;
};

export default function UserStatisticCard({
  amount,
  label,
}: UserStatisticCardProps) {
  const renderAmountNumber = (amount: number) => {
    if (amount >= 10_000) {
      return `${Math.round(amount / 1000)}k`;
    }
    if (amount >= 1_000_000) {
      return `${Math.round(amount / 1_000_000)}m`;
    }
    return amount;
  };

  return (
    <div className="border border-base-content rounded-xl inline-flex w-[88px] flex-col px-3 py-2">
      <span className="text-2xl font-bold">{renderAmountNumber(amount)}</span>
      <span className="text-sm text-neutral-content">{label}</span>
    </div>
  );
}
