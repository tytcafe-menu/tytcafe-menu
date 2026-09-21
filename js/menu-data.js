/**
 * TYT – Take Your Time | Menu Data
 * -----------------------------------------------------------------
 * Every name, description and price below was transcribed directly
 * from the café's printed menu photo. Nothing here was invented.
 * A few words on the original menu were hard to read clearly —
 * those items carry a `note` field explaining exactly what was
 * uncertain, instead of silently guessing.
 *
 * TO EDIT THE MENU: change the values in this file only. Every
 * price is in EGP (Egyptian Pounds) as printed on the menu.
 * -----------------------------------------------------------------
 */

const MENU_DATA = [
  {
    id: "hot-coffee",
    name: "Hot Coffee",
    icon: "coffee",
    items: [
      { name: "Single Espresso", price: 40, description: "Pulled espresso shot", image: "images/menu/single-espresso.webp" },
      { name: "Double Espresso", price: 55, description: "Double shot of pulled espresso", image: "images/menu/double-espresso.webp" },
      { name: "American Coffee", price: 55, description: "Espresso · hot water", image: "images/menu/american-coffee.webp" },
      {
        name: "Cappuccino",
        price: 75,
        description: "Espresso · steamed milk · milk foam",
        image: "images/menu/cappuccino.webp",
        note: "Price corrected to 75 EGP after checking the café's live POS screen — the printed menu had listed 65."
      },
      { name: "Latte", price: 65, description: "Espresso · steamed milk · light foam", image: "images/menu/latte.webp" },
      { name: "Cortado", price: 65, description: "Espresso · steamed milk, equal parts", image: "images/menu/cortado.webp" },
      { name: "Spanish Latte", price: 80, description: "Espresso · milk · condensed milk", image: "images/menu/spanish-latte.webp" },
      { name: "Macchiato", price: 40, description: "Espresso · a dash of milk foam", image: "images/menu/macchiato.webp" },
      { name: "Nutella Coffee", price: 75, description: "Espresso · Nutella · whipped cream · cone biscuit", image: "images/menu/nutella-coffee.webp" },
      { name: "Lotus Coffee", price: 80, description: "Espresso · lotus sauce · whipped cream · lotus biscuit", image: "images/menu/lotus-coffee.webp" },
      { name: "Flat White", price: 70, description: "Espresso · steamed milk · thin microfoam", image: "images/menu/flat-white.webp" },
      { name: "Pistachio Coffee", price: 85, description: "Espresso · pistachio sauce · whipped cream · nuts", image: "images/menu/pistachio-coffee.webp" },
      { name: "Hot Mocha", price: 65, description: "Espresso · chocolate sauce · steamed milk · whipped cream", image: "images/menu/hot-mocha.webp" },
      { name: "White Mocha", price: 65, description: "Espresso · white chocolate sauce · steamed milk", image: "images/menu/white-mocha.webp" },
      { name: "Turkish Coffee", price: 35, description: "Finely ground coffee brewed with water", image: "images/menu/turkish-coffee.webp" },
      { name: "Turkish Coffee Double", price: 45, description: "Double measure of Turkish coffee", image: "images/menu/turkish-coffee-double.webp" },
      {
        name: "Turkish Coffee With Milk",
        price: 50,
        description: "Turkish coffee · milk",
        note: "Price corrected to 50 EGP after checking the café's live POS screen — the printed menu had listed 45.",
        image: "images/menu/turkish-coffee-with-milk.webp"
      },
      { name: "Turkish Coffee With Flavors", price: 50, description: "Turkish coffee · choice of flavor", image: "images/menu/turkish-coffee-with-flavors.webp" },
      { name: "Nescafé", price: 65, description: "Instant coffee · hot water", image: "images/menu/nescafe.webp" },
      {
        name: "TYT Caffè",
        price: 85,
        description: "Peanut butter · white chocolate sauce · chocolate powder · milk · single shot espresso",
        image: "images/menu/tyt-caffe.webp",
        note: "Description printed across two lines on the menu — order transcribed as best as legible."
      },
      {
        name: "Special Coffee",
        price: 25,
        image: "images/menu/special-coffee.webp",
        note: "Added from the café's POS system (listed there as \"Coffee خاص\" / house blend) — not on the original printed menu photo."
      }
    ]
  },
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    icon: "iced",
    items: [
      { name: "Iced Latte", price: 75, description: "Espresso · cold milk · ice", image: "images/menu/iced-latte.webp" },
      { name: "Iced Spanish Latte", price: 75, description: "Espresso · milk · condensed milk · ice", image: "images/menu/iced-spanish-latte.webp" },
      { name: "Iced Cappuccino", price: 60, description: "Espresso · cold milk · ice · foam", image: "images/menu/iced-cappuccino.webp" },
      { name: "Iced Mocha", price: 75, description: "Espresso · chocolate sauce · cold milk · ice", image: "images/menu/iced-mocha.webp" },
      { name: "Iced White Mocha", price: 75, description: "Espresso · white chocolate sauce · cold milk · ice", image: "images/menu/iced-white-mocha.webp" },
      { name: "Matcha Latte", price: 90, description: "Matcha · milk · ice", image: "images/menu/matcha-latte.webp" },
      { name: "Caramel Macchiato", price: 75, description: "Espresso · vanilla flavor · milk · caramel drizzle · ice", image: "images/menu/caramel-macchiato.webp" },
      { name: "Salted Caramel Latte", price: 80, description: "Espresso · salted caramel sauce · milk · ice", image: "images/menu/salted-caramel-latte.webp" },
      { name: "Spanish Matcha", price: 80, description: "Milk · condensed milk · matcha", image: "images/menu/spanish-matcha.webp" },
      { name: "Strawberry Matcha", price: 80, description: "Strawberry · matcha · milk · ice", image: "images/menu/strawberry-matcha.webp" },
      { name: "Mango Matcha", price: 80, description: "Mango · matcha · milk · ice", image: "images/menu/mango-matcha.webp" },
      { name: "Bottle Iced Spanish Latte", price: 95, description: "Espresso · milk · condensed milk, bottled", image: "images/menu/bottle-iced-spanish-latte.webp" },
      { name: "Boba Iced Coffee", price: 95, description: "Boba · iced coffee milk · espresso", image: "images/menu/boba-iced-coffee.webp" }
    ]
  },
  {
    id: "specialty-coffee",
    name: "Specialty Coffee",
    icon: "bean",
    description: "Specialty coffee beans",
    items: [
      { name: "V60", price: 120, description: "Hot or cold", image: "images/menu/v60.webp" },
      { name: "Syphon", price: 120, description: "Hot or cold", image: "images/menu/syphon.webp" },
      { name: "Chemex", price: 120, description: "Hot or cold", image: "images/menu/chemex.webp" },
      { name: "Cold Brew", price: 110, description: "Coarse coffee steeped in cold water for hours", image: "images/menu/cold-brew.webp" },
      { name: "Aeropress", price: 120, description: "Hot or cold", image: "images/menu/aeropress.webp" },
      { name: "French Press", price: 80, description: "Coarse coffee steeped in hot water, pressed", image: "images/menu/french-press.webp" }
    ]
  },
  {
    id: "hot-non-coffee",
    name: "Hot Non-Coffee",
    icon: "tea",
    items: [
      { name: "Red Tea", price: 25, description: "Black tea brewed in hot water", image: "images/menu/red-tea.webp" },
      { name: "Green Tea", price: 25, description: "Green tea brewed in hot water", image: "images/menu/green-tea.webp" },
      { name: "Flavored Tea", price: 35, description: "Tea · choice of flavor", image: "images/menu/flavored-tea.webp" },
      { name: "Anise", price: 25, description: "Anise seeds brewed in hot water", image: "images/menu/anise-tea.webp" },
      { name: "Mint", price: 25, description: "Fresh mint brewed in hot water", image: "images/menu/mint-tea.webp" },
      { name: "Herbal Cocktail", price: 45, description: "Anise · fresh mint · lemon · honey", image: "images/menu/herbal-cocktail.webp" },
      { name: "Apple Cider", price: 45, description: "Apple juice · cinnamon sticks", image: "images/menu/apple-cider.webp" },
      { name: "Hot Chocolate", price: 70, description: "Chocolate powder · whipped cream · milk", image: "images/menu/hot-chocolate-drink.webp" },
      { name: "Hot Avocado", price: 70, description: "Avocado · vanilla ice cream", image: "images/menu/hot-avocado.webp" },
      { name: "Hot Lotus", price: 85, description: "Lotus sauce · milk · caramel flavor · whipped cream", image: "images/menu/hot-lotus.webp" }
    ]
  },
  {
    id: "fresh-juices",
    name: "Fresh Juices",
    icon: "citrus",
    items: [
      { name: "Mango", price: 70, description: "Fresh mango", image: "images/menu/mango-juice.webp" },
      { name: "Guava", price: 70, description: "Fresh guava", image: "images/menu/guava-juice.webp" },
      { name: "Strawberry", price: 75, description: "Fresh strawberry", image: "images/menu/strawberry-juice.webp" },
      { name: "Orange", price: 75, description: "Fresh orange", image: "images/menu/orange-juice.webp" },
      { name: "Lemon or Lemon Mint", price: 55, description: "Fresh mint · lime · mint flavor", image: "images/menu/lemon-mint.webp" },
      { name: "Alaska Cocktail", price: 75, description: "Pineapple · peach · fresh mint · pineapple slice", image: "images/menu/alaska-cocktail.webp" },
      { name: "Mango Peach Cocktail", price: 80, description: "Fresh mint · lime · mango", image: "images/menu/mango-peach-cocktail.webp" },
      { name: "Banana with Milk", price: 85, description: "Banana · milk", image: "images/menu/banana-with-milk.webp", note: "Added from the café's POS system — not on the original printed menu photo." },
      { name: "Dates with Milk", price: 95, description: "Dates · milk", image: "images/menu/dates-with-milk.webp", note: "Added from the café's POS system — not on the original printed menu photo." },
      { name: "Power Cocktail", price: 100, note: "Added from the café's POS system — not on the original printed menu photo. Exact fruit mix not specified there." },
      { name: "Avocado", price: 90, description: "Fresh avocado · milk", image: "images/menu/avocado-juice.webp", note: "Added from the café's POS system — not on the original printed menu photo." },
      { name: "Avocado Honey", price: 120, description: "Fresh avocado · milk · honey", image: "images/menu/avocado-honey.webp", note: "Added from the café's POS system — not on the original printed menu photo." }
    ]
  },
  {
    id: "smoothies",
    name: "Smoothies",
    icon: "smoothie",
    items: [
      { name: "Smooth Lemon Mint", price: 80, description: "Fresh mint · milk", image: "images/menu/smooth-lemon-mint.webp" },
      { name: "TYT Smoothie", price: 85, description: "Mango · passion fruit · peach", image: "images/menu/tyt-smoothie.webp" },
      { name: "Smoothie Mixed Berry", price: 85, description: "Mixed berries", image: "images/menu/smoothie-mixed-berry.webp" },
      { name: "Smoothie Passion Fruit", price: 85, description: "Passion fruit", image: "images/menu/smoothie-passion-fruit.webp" },
      { name: "Smoothie Piña Colada", price: 85, description: "Blue curaçao · coconut flavor · pineapple · pineapple slice", image: "images/menu/smoothie-pina-colada.webp" },
      { name: "Smoothie Blueberry", price: 85, description: "Blueberry", image: "images/menu/smoothie-blueberry.webp" }
    ]
  },
  {
    id: "milkshakes",
    name: "Milkshakes",
    icon: "shake",
    items: [
      { name: "Vanilla Shake", price: 85, description: "Ice cream · milk · whipped cream", image: "images/menu/vanilla-shake.webp" },
      { name: "Blueberry Vanilla Shake", price: 90, description: "Ice cream · blueberry · milk · whipped cream", image: "images/menu/blueberry-vanilla-shake.webp" },
      { name: "Strawberry Shake", price: 85, description: "Ice cream · milk · whipped cream", image: "images/menu/strawberry-shake.webp" },
      { name: "Pistachio Shake", price: 95, description: "Pistachio sauce · milk · whipped cream", image: "images/menu/pistachio-shake.webp" },
      {
        name: "Cake Shake",
        price: 105,
        description: "Ice cream · whipped cream · dessert of your choice",
        note: "Menu lists this as add a dessert of your choice — the specific dessert options aren't specified on the menu.",
        image: "images/menu/cake-shake.webp"
      },
      { name: "Cookies Shake", price: 105, description: "Cookies-flavor ice cream · whipped cream", image: "images/menu/cookies-shake.webp" },
      { name: "Mango Shake", price: 85, description: "Ice cream · mango · whipped cream", image: "images/menu/mango-shake.webp" },
      { name: "Oreo Shake", price: 90, description: "Ice cream · Oreo · whipped cream", image: "images/menu/oreo-shake.webp" }
    ]
  },
  {
    id: "coffee-frappe",
    name: "Coffee Frappé",
    icon: "frappe",
    items: [
      { name: "Vanilla Coffee Frappé", price: 95, description: "Vanilla flavor · milk · whipped cream", image: "images/menu/vanilla-coffee-frappe.webp" },
      { name: "Caramel Frappé", price: 95, description: "Caramel flavor · milk · caramel sauce · whipped cream", image: "images/menu/caramel-frappe.webp" },
      { name: "Mocha Frappé", price: 105, description: "Chocolate powder · milk · chocolate sauce · whipped cream", image: "images/menu/mocha-frappe.webp" },
      { name: "Lotus Frappé", price: 95, description: "Lotus sauce · milk · lotus biscuit · whipped cream", image: "images/menu/lotus-frappe.webp" },
      { name: "Cookies Frappé", price: 105, description: "Cookies flavor · milk · chocolate powder · whipped cream", image: "images/menu/cookies-frappe.webp" },
      {
        name: "TYT Frappé",
        price: 105,
        description: "Milk · caramel sauce · whipped cream · condensed milk",
        note: "One word in the flavor description was not clearly legible on the menu photo and has been left out rather than guessed.",
        image: "images/menu/tyt-frappe.webp"
      },
      { name: "White Mocha Frappé", price: 95, description: "White chocolate sauce · milk · caramel sauce · whipped cream", image: "images/menu/white-mocha-frappe.webp" },
      { name: "Irish Frappé", price: 105, description: "Irish flavor · milk · caramel sauce · whipped cream", image: "images/menu/irish-frappe.webp" }
    ]
  },
  {
    id: "non-coffee-frappe",
    name: "Non-Coffee Frappé",
    icon: "frappe",
    items: [
      { name: "Vanilla Frappé", price: 95, description: "Vanilla flavor · milk", image: "images/menu/vanilla-frappe.webp" },
      { name: "Strawberry Frappé", price: 95, description: "Strawberry · milk", image: "images/menu/strawberry-frappe.webp" },
      { name: "Mango Frappé", price: 95, description: "Mango · milk", image: "images/menu/mango-frappe.webp" },
      { name: "Blueberry Frappé", price: 100, description: "Blueberry · milk", image: "images/menu/blueberry-frappe.webp" },
      { name: "Passion Frappé", price: 95, description: "Passion fruit · milk", image: "images/menu/passion-frappe.webp" }
    ]
  },
  {
    id: "soda-soft-drinks",
    name: "Refresh Soda & Soft Drinks",
    icon: "soda",
    items: [
      { name: "Soft Drink", price: 85 },
      { name: "Red Bull", price: 90, image: "images/menu/red-bull.webp" },
      { name: "Mojito Soda", price: 95, description: "Lime soda · mint flavor · mojito flavor · fresh mint · lime", image: "images/menu/mojito-soda.webp" },
      { name: "Red Bull Coffee", price: 85, description: "Single shot espresso", image: "images/menu/red-bull-coffee.webp" },
      { name: "Red Bull Mix Berry", price: 95, description: "Mixed berries", image: "images/menu/red-bull-mix-berry.webp" },
      {
        name: "Scotch Mint",
        price: 65,
        image: "images/menu/scotch-mint.webp",
        description: "Lime soda · mint flavor · lime",
        note: "Price corrected to 65 EGP after checking the café's live POS screen — the printed menu had listed 105."
      },
      {
        name: "Sunshine",
        price: 70,
        description: "Lime soda · pomegranate flavor · orange · lime",
        image: "images/menu/sunshine.webp",
        note: "Price corrected to 70 EGP after checking the café's live POS screen — the printed menu had listed 105."
      },
      {
        name: "Cherry Cola",
        price: 70,
        image: "images/menu/cherry-cola.webp",
        description: "Cherry flavor · cola",
        note: "Price corrected to 70 EGP after checking the café's live POS screen (previously 85). The second ingredient word was also unclear on the original menu photo — shown here as \"cola,\" the most likely reading."
      },
      { name: "Boba Soda", price: 90, description: "Lime soda · boba · fresh mint · lime", image: "images/menu/boba-soda.webp" }
    ]
  },
  {
    id: "canned-soft-drinks",
    name: "Soft Drink",
    icon: "soda",
    description: "Canned & bottled soft drinks",
    note: "New category added from the café's POS system — not on the original printed menu photo. Item names were read from small Arabic labels on the POS screen (via video, not a clear photo), so brand/flavor names carry extra uncertainty — please double-check against the register before publishing.",
    items: [
      { name: "Pepsi Can", price: 30, image: "images/menu/pepsi-can.webp" },
      { name: "7Up Can", price: 30, image: "images/menu/7up-can.webp" },
      { name: "Mirinda Can", price: 25, image: "images/menu/mirinda-can.webp" },
      { name: "Pepsi Mojito Can", price: 25, note: "POS label read as \"Pepsi Mojito\" — an unusual flavor combination, worth confirming." },
      { name: "Mountain Dew Can", price: 30, image: "images/menu/mountain-dew-can.webp" },
      { name: "Fayrouz Pineapple", price: 30, image: "images/menu/fayrouz-pineapple.webp" },
      { name: "Birell Can", price: 30, note: "POS label was hard to read clearly on video; \"Birell\" (non-alcoholic malt drink) is the best guess. Please confirm.", image: "images/menu/birell-can.webp" },
      { name: "V7 Pink Lemonade", price: 25, image: "images/menu/v7-pink-lemonade.webp" },
      { name: "V7 Flavor", price: 25, note: "Two separate POS buttons both showed \"V7\" with a flavor word that wasn't legible on video. Please confirm the two flavor names." },
      { name: "V7 Cola", price: 30, image: "images/menu/v7-cola.webp" },
      { name: "Nescafé Can", price: 40, note: "POS showed four separate Nescafé-can buttons, all at 40 EGP — likely different flavors (e.g. original, latte, mocha, caramel) but the flavor labels weren't legible on video. Shown here as one line; please confirm the actual flavor names.", image: "images/menu/nescafe-can.webp" },
      { name: "Rani Juice", price: 30, image: "images/menu/rani-juice.webp" }
    ]
  },
  {
    id: "croissant",
    name: "Croissant",
    icon: "croissant",
    items: [
      { name: "Plain Croissant", price: 60, image: "images/menu/plain-croissant.webp" },
      { name: "Cheese Croissant", price: 70 },
      { name: "Turkey Cheese Croissant", price: 130 }
    ]
  },
  {
    id: "tyt-beans",
    name: "TYT Beans",
    icon: "bean",
    description: "Whole-bean coffee bags to take home",
    note: "New category added from the café's POS system — not on the original printed menu photo.",
    items: [
      { name: "Light Roast", price: 250, image: "images/menu/tyt-light-roast.webp" },
      {
        name: "Medium Roast",
        price: 280,
        image: "images/menu/tyt-medium-roast.webp",
        note: "Listed on the POS screen as \"Medium Herb\" — almost certainly a POS typo for \"Medium Roast\"; shown here corrected. Please confirm."
      }
    ]
  },
  {
    id: "waffle-pancake",
    name: "Waffle & Pancake",
    icon: "dessert",
    note: "New category added from the café's POS system — not on the original printed menu photo.",
    items: [
      { name: "Waffle", price: 35, image: "images/menu/waffle.webp" },
      { name: "Pancake (6 pieces)", price: 50, image: "images/menu/pancake.webp" },
      { name: "Pancake (12 pieces)", price: 80, image: "images/menu/pancake.webp" },
      { name: "Pancake (24 pieces)", price: 120, image: "images/menu/pancake.webp" }
    ]
  },
  {
    id: "desserts",
    name: "Desserts",
    icon: "dessert",
    note: "New category added from the café's POS system — not on the original printed menu photo.",
    items: [
      { name: "Molten Cake", price: 90, image: "images/menu/molten-cake.webp" },
      { name: "Cheesecake", price: 80, image: "images/menu/cheesecake.webp" },
      { name: "Chocolate Fudge", price: 65, image: "images/menu/chocolate-fudge.webp" },
      { name: "Red Velvet", price: 120, image: "images/menu/red-velvet.webp" }
    ]
  },
  {
    id: "mochi",
    name: "Mochi",
    icon: "shake",
    note: "New category added from the café's POS system — not on the original printed menu photo.",
    items: [
      { name: "Mochi (1 piece)", price: 70, image: "images/menu/mochi.webp" }
    ]
  },
  {
    id: "extras",
    name: "Extras",
    icon: "extra",
    description: "Add to any drink",
    items: [
      { name: "Shot", price: 25 },
      { name: "Sauce", price: 25 },
      { name: "Flavor", price: 25 },
      { name: "Ice Cream", price: 30 },
      { name: "Honey", price: 30 },
      { name: "Whipped Cream", price: 35 },
      { name: "Nuts", price: 25 },
      { name: "Nutella", price: 25 },
      { name: "Milk", price: 25 }
    ]
  }
];

// Flat list of items (and whole categories) that carry an uncertainty note
// — surfaced quietly in the admin/editor comment above, not shown to site
// visitors.
const MENU_NOTES = [
  ...MENU_DATA.filter((cat) => cat.note).map((cat) => ({ category: cat.name, item: null, note: cat.note })),
  ...MENU_DATA.flatMap((cat) =>
    cat.items.filter((i) => i.note).map((i) => ({ category: cat.name, item: i.name, note: i.note }))
  )
];
