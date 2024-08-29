export default function Title({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
        <div className="flex gap-3 md:flex-nowrap flex-wrap">{children}</div>
      </div>
    </>
  );
}
