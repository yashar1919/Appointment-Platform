import { BusinessConfig } from "@/src/types/domain";
import { fetchApi, USE_MOCK_DATA } from "../api/httpClient";
import { getTenantConfig } from "@/src/config/tenantConfigs";
import { mockTenant } from "@/src/mocks/data";

export interface TenantRepository {
  getTenant(slug: string): Promise<BusinessConfig | null>;
}

type ApiService = BusinessConfig["services"][number] & {
  category_id?: string;
  duration_minutes?: number | string;
  sort_order?: number | string;
  staff_ids?: string[];
  included_items?: string[];
  care_instructions?: string;
  is_featured?: boolean;
  is_popular?: boolean;
};

type ApiStaff = BusinessConfig["staff"][number] & {
  experience_years?: number | string;
  is_available?: boolean;
  service_ids?: string[];
};

type ApiLocation = BusinessConfig["locations"][number] & {
  postal_code?: string;
  working_hours?: BusinessConfig["workingHours"];
};

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

function toFiniteNumber(value: unknown, fallback: number): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export class HttpTenantRepository implements TenantRepository {
  async getTenant(slug: string): Promise<BusinessConfig | null> {
    const staticConfig = getTenantConfig(slug);
    if (!staticConfig) return null;

    const baseConfig = USE_MOCK_DATA
      ? {
          ...staticConfig,
          ...mockTenant,
          phoneDisplay: mockTenant.phone,
        }
      : staticConfig;

    try {
      const [services, staff, locations] = await Promise.all([
        fetchApi<ApiService[]>(`/${baseConfig.slug}/services`),
        fetchApi<ApiStaff[]>(`/${baseConfig.slug}/staff`),
        fetchApi<ApiLocation[]>(`/${baseConfig.slug}/locations`),
      ]);

      const mappedServices = services.map((apiService) => {
        const localService = baseConfig.services.find(
          (service) =>
            normalizeName(service.name) === normalizeName(apiService.name),
        );

        return {
          id: apiService.id,
          categoryId: apiService.category_id ?? localService?.categoryId ?? "",
          slug: apiService.slug ?? localService?.slug,
          name: apiService.name,
          description:
            apiService.description ?? localService?.description ?? "",
          durationMinutes: toFiniteNumber(
            apiService.duration_minutes ?? apiService.durationMinutes,
            localService?.durationMinutes ?? 0,
          ),
          price: toFiniteNumber(apiService.price, localService?.price ?? 0),
          isFeatured:
            apiService.is_featured ??
            apiService.isFeatured ??
            localService?.isFeatured ??
            false,
          isPopular:
            apiService.is_popular ??
            apiService.isPopular ??
            localService?.isPopular ??
            false,
          image: localService?.image || apiService.image || "",
          active: true,
          sortOrder: toFiniteNumber(
            apiService.sort_order ?? apiService.sortOrder,
            localService?.sortOrder ?? 0,
          ),
          staffIds: apiService.staff_ids ?? apiService.staffIds,
          includedItems:
            apiService.included_items ??
            apiService.includedItems ??
            localService?.includedItems ??
            [],
          careInstructions:
            apiService.care_instructions ??
            apiService.careInstructions ??
            localService?.careInstructions ??
            "",
        };
      });

      const mappedStaff = staff.map((apiStaff) => {
        const localStaff = baseConfig.staff.find(
          (member) =>
            normalizeName(member.name) === normalizeName(apiStaff.name),
        );

        return {
          id: apiStaff.id,
          name: apiStaff.name,
          role: apiStaff.role ?? localStaff?.role ?? "",
          avatar: localStaff?.avatar || apiStaff.avatar || "",
          bio: apiStaff.bio ?? localStaff?.bio ?? "",
          active: true,
          experienceYears: toFiniteNumber(
            apiStaff.experience_years ?? apiStaff.experienceYears,
            localStaff?.experienceYears ?? 0,
          ),
          specialties: apiStaff.specialties ?? localStaff?.specialties ?? [],
          rating: apiStaff.rating ?? localStaff?.rating ?? 0,
          isAvailable: apiStaff.is_available ?? localStaff?.isAvailable ?? true,
          serviceIds: apiStaff.service_ids ?? apiStaff.serviceIds,
        };
      });

      const mappedLocations = locations.map((apiLocation) => {
        const localLocation = baseConfig.locations.find(
          (location) =>
            normalizeName(location.name) === normalizeName(apiLocation.name),
        );

        return {
          id: apiLocation.id,
          name: apiLocation.name,
          address: apiLocation.address ?? localLocation?.address ?? "",
          city: apiLocation.city ?? localLocation?.city ?? "",
          postalCode:
            apiLocation.postal_code ?? localLocation?.postalCode ?? "",
          latitude: apiLocation.latitude ?? localLocation?.latitude,
          longitude: apiLocation.longitude ?? localLocation?.longitude,
          directions: apiLocation.directions ?? localLocation?.directions ?? "",
          phone: apiLocation.phone ?? localLocation?.phone ?? "",
          workingHours:
            apiLocation.working_hours ?? localLocation?.workingHours,
        };
      });

      console.log("Mapped services:", mappedServices);

      console.log(
        "[TenantRepository] Mapped service images:",
        mappedServices.map(({ name, image }) => ({ name, image })),
      );
      console.log(
        "[TenantRepository] Mapped staff avatars:",
        mappedStaff.map(({ name, avatar }) => ({ name, avatar })),
      );

      return {
        ...baseConfig,
        services: mappedServices,
        staff: mappedStaff,
        locations: mappedLocations,
      };
    } catch (error) {
      console.error("Failed to load tenant:", error);
      return null;
    }
  }
}
