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
    })),
  ),
)
