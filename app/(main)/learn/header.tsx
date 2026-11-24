type HeaderProps = {
  title: string;
};

// Ported from sanidhyy/duolingo-clone (MIT). The back arrow to the course list is
// gone; one sticky header per tier shows which tier you are in as you scroll.
export const Header = ({ title }: HeaderProps) => {
  return (
    <div className="sticky top-[50px] z-10 mb-5 flex items-center justify-center border-b-2 bg-background pb-3 text-wolf lg:top-0 lg:z-50 lg:mt-[-28px] lg:pt-[28px]">
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
};
