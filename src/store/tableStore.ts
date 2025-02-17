import create from "zustand";

type Package = {
  id: number;
  name: string;
  shipping_fee: number;
};

type PackageState = {
  packages: Package[] | null;
  setPackages: (packages: Package[] | null) => void;
};

export const usePackageStore = create<PackageState>((set) => ({
  packages: null,
  setPackages: (packages) => set({ packages }),
}));
