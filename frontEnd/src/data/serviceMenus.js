import catalog from "./serviceMenus.json"

export const serviceMenus = catalog.menus

export const bookingServices = serviceMenus.flatMap((menu) =>
  menu.groups.flatMap((group) =>
    group.items.map((item) => ({
      menuId: menu.id,
      menuTitle: menu.title,
      groupTitle: group.title,
      name: item.name,
      price: item.price,
      detail: item.detail || "",
      includes: item.includes || [],
      optionalAddons: item.optionalAddons || [],
    })),
  ),
)

export function findCatalogService(menuId, groupTitle, name) {
  const menu = serviceMenus.find((entry) => entry.id === menuId)
  const group = menu?.groups.find((entry) => entry.title === groupTitle)
  return group?.items.find((entry) => entry.name === name) || null
}
