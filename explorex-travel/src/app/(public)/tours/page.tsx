import { ToursBrowser } from "@/components/public/tours-browser";
import { isDatabaseUnavailableError } from "@/lib/db/mysql";
import { listTourGroups } from "@/services/tour-group.service";
import { listPublicTours } from "@/services/tour.service";
import type { TourGroup } from "@/types/tour-group";
import type { PublicTourSummary } from "@/types/tour";

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    group?: string;
    date?: string;
    price?: string;
    seats?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const keyword = params.q?.trim() || undefined;
  const maNhomTour = params.group?.trim() || undefined;

  let tours: PublicTourSummary[] = [];
  let groups: TourGroup[] = [];
  let dbUnavailable = false;

  try {
    [tours, groups] = await Promise.all([
      listPublicTours({ keyword, maNhomTour }),
      listTourGroups(),
    ]);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }

    dbUnavailable = true;
  }

  return (
    <ToursBrowser
      dbUnavailable={dbUnavailable}
      groups={groups}
      initialFilters={{
        q: params.q,
        group: params.group,
        date: params.date,
        price: params.price,
        seats: params.seats,
        sort: params.sort,
        page: params.page,
      }}
      tours={tours}
    />
  );
}
