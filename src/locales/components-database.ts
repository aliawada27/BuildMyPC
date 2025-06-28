import { PCComponent } from '@/types/pc-components'

export const pcComponentsDatabase: PCComponent[] = [
  // CPUs
  {
    id: 'cpu-001',
    name: 'AMD Ryzen 7 7700X',
    brand: 'AMD',
    category: 'cpu',
    price: 349,
    specs: {
      cores: 8,
      threads: 16,
      baseClock: 4.5,
      boostClock: 5.4,
      cache: '32MB L3',
      tdp: 105,
      architecture: 'Zen 4'
    },
    compatibility: {
      socket: 'AM5',
      memoryType: 'DDR5'
    },
    powerConsumption: 105,
    pros: ['Excellent gaming performance', 'Great multi-threaded performance', 'PCIe 5.0 support'],
    cons: ['Requires DDR5 memory', 'Runs hot under load'],
    vendorLinks: [
      { vendor: 'Amazon', url: '#', price: 349, inStock: true },
      { vendor: 'Newegg', url: '#', price: 359, inStock: true }
    ]
  },
  {
    id: 'cpu-002',
    name: 'Intel Core i5-13600K',
    brand: 'Intel',
    category: 'cpu',
    price: 289,
    specs: {
      cores: 14,
      threads: 20,
      baseClock: 3.5,
      boostClock: 5.1,
      cache: '24MB L3',
      tdp: 125,
      architecture: '13th Gen'
    },
    compatibility: {
      socket: 'LGA1700',
      memoryType: 'DDR4/DDR5'
    },
    powerConsumption: 125,
    pros: ['Excellent price/performance', 'DDR4 compatible', 'Great for gaming'],
    cons: ['Higher power consumption', 'Requires good cooling'],
    vendorLinks: [
      { vendor: 'Amazon', url: '#', price: 289, inStock: true },
      { vendor: 'Best Buy', url: '#', price: 299, inStock: false }
    ]
  },
  {
    id: 'cpu-003',
    name: 'AMD Ryzen 5 5600X',
    brand: 'AMD',
    category: 'cpu',
    price: 149,
    specs: {
      cores: 6,
      threads: 12,
      baseClock: 3.7,
      boostClock: 4.6,
      cache: '32MB L3',
      tdp: 65,
      architecture: 'Zen 3'
    },
    compatibility: {
      socket: 'AM4',
      memoryType: 'DDR4'
    },
    powerConsumption: 65,
    pros: ['Excellent value', 'Low power consumption', 'Great for budget builds'],
    cons: ['Older platform', 'No PCIe 5.0'],
    vendorLinks: [
      { vendor: 'Amazon', url: '#', price: 149, inStock: true },
      { vendor: 'Micro Center', url: '#', price: 139, inStock: true }
    ]
  },

  // GPUs
  {
    id: 'gpu-001',
    name: 'NVIDIA RTX 4070',
    brand: 'NVIDIA',
    category: 'gpu',
    price: 599,
    specs: {
      memory: '12GB GDDR6X',
      baseClock: 1920,
      boostClock: 2475,
      memorySpeed: 21000,
      busWidth: 192,
      rtCores: 3584,
      dlss: '3.0'
    },
    compatibility: {
      pciSlots: 2,
      powerConnectors: ['8-pin', '8-pin'],
      dimensions: { length: 300, width: 137, height: 61 }
    },
    powerConsumption: 200,
    pros: ['Excellent 1440p gaming', 'DLSS 3.0', 'Good power efficiency'],
    cons: ['Expensive', 'Limited ray tracing at 4K'],
    vendorLinks: [
      { vendor: 'Amazon', url: '#', price: 599, inStock: true },
      { vendor: 'Newegg', url: '#', price: 589, inStock: false }
    ]
  },
  {
    id: 'gpu-002',
    name: 'AMD RX 6700 XT',
    brand: 'AMD',
    category: 'gpu',
    price: 349,
    specs: {
      memory: '12GB GDDR6',
      baseClock: 2321,
      boostClock: 2581,
      memorySpeed: 16000,
      busWidth: 192,
      streamProcessors: 2560
    },
    compatibility: {
      pciSlots: 2,
      powerConnectors: ['8-pin', '6-pin'],
      dimensions: { length: 267, width: 120, height: 50 }
    },
    powerConsumption: 230,
    pros: ['Great 1440p performance', 'Good value', 'Large VRAM buffer'],
    cons: ['Higher power consumption', 'No DLSS equivalent'],
    vendorLinks: [
      { vendor: 'Amazon', url: '#', price: 349, inStock: true },
      { vendor: 'Best Buy', url: '#', price: 369, inStock: true }
    ]
  },

  // Motherboards
  {
    id: 'mobo-001',
    name: 'ASUS ROG STRIX B650-A',
    brand: 'ASUS',
    category: 'motherboard',
    price: 229,
    specs: {
      chipset: 'B650',
      memorySlots: 4,
      maxMemory: 128,
      expansion: ['1x PCIe 5.0 x16', '1x PCIe 4.0 x16', '2x PCIe 4.0 x1'],
      storage: ['4x SATA', '2x M.2'],
      usb: ['USB 3.2 Gen 2', 'USB-C'],
      ethernet: 'Gigabit',
      wifi: 'Wi-Fi 6E'
    },
    compatibility: {
      socket: 'AM5',
      formFactor: 'ATX',
      memoryType: 'DDR5'
    },
    pros: ['Wi-Fi 6E included', 'PCIe 5.0 support', 'Good build quality'],
    cons: ['DDR5 only', 'No Thunderbolt'],
    vendorLinks: [
      { vendor: 'Amazon', url: '#', price: 229, inStock: true }
    ]
  },

  // Memory
  {
    id: 'ram-001',
    name: 'Corsair Vengeance LPX 32GB (2x16GB) DDR4-3200',
    brand: 'Corsair',
    category: 'memory',
    price: 89,
    specs: {
      capacity: 32,
      speed: 3200,
      type: 'DDR4',
      latency: 'CL16',
      voltage: 1.35,
      sticks: 2
    },
    compatibility: {
      memoryType: 'DDR4'
    },
    pros: ['Excellent value', 'Reliable', 'Low profile design'],
    cons: ['Not the fastest', 'Basic heatspreader'],
    vendorLinks: [
      { vendor: 'Amazon', url: '#', price: 89, inStock: true }
    ]
  },

  // Storage
  {
    id: 'ssd-001',
    name: 'Samsung 980 PRO 1TB NVMe SSD',
    brand: 'Samsung',
    category: 'storage',
    price: 79,
    specs: {
      capacity: 1000,
      type: 'NVMe SSD',
      interface: 'M.2 PCIe 4.0',
      readSpeed: 7000,
      writeSpeed: 5000,
      endurance: '600 TBW'
    },
    compatibility: {
      formFactor: 'M.2 2280'
    },
    pros: ['Very fast', 'Reliable', 'Good endurance'],
    cons: ['Price premium', 'Gets hot under sustained load'],
    vendorLinks: [
      { vendor: 'Amazon', url: '#', price: 79, inStock: true }
    ]
  },

  // Power Supplies
  {
    id: 'psu-001',
    name: 'Corsair RM750x 750W 80+ Gold',
    brand: 'Corsair',
    category: 'power-supply',
    price: 119,
    specs: {
      wattage: 750,
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      fanSize: 135,
      warranty: 10
    },
    compatibility: {
      formFactor: 'ATX',
      powerConnectors: ['24-pin ATX', '8-pin CPU', '6x PCIe']
    },
    pros: ['Fully modular', '10-year warranty', 'Quiet operation'],
    cons: ['Higher cost', 'Large size'],
    vendorLinks: [
      { vendor: 'Amazon', url: '#', price: 119, inStock: true }
    ]
  },

  // Cases
  {
    id: 'case-001',
    name: 'Fractal Design Define 7',
    brand: 'Fractal Design',
    category: 'case',
    price: 169,
    specs: {
      type: 'Mid Tower',
      motherboardSupport: ['ATX', 'mATX', 'Mini-ITX'],
      expansionSlots: 7,
      driveBays: ['2x 3.5"', '3x 2.5"'],
      frontPorts: ['2x USB 3.0', '1x USB-C'],
      maxGpuLength: 440,
      maxCpuHeight: 185
    },
    compatibility: {
      formFactor: 'ATX',
      dimensions: { length: 543, width: 240, height: 475 }
    },
    pros: ['Excellent build quality', 'Sound dampening', 'Good airflow'],
    cons: ['Expensive', 'Heavy', 'Limited RGB'],
    vendorLinks: [
      { vendor: 'Amazon', url: '#', price: 169, inStock: true }
    ]
  }
] 