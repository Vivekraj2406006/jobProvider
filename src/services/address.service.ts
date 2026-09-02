import { prisma } from "@/lib/prisma";
import { AddressInput, UpdateAddressInput } from "@/types/address";

export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        isDefault: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function createAddress(userId: string, data: AddressInput) {
  return prisma.$transaction(async (tx) => {
    const existingCount = await tx.address.count({
      where: {
        userId,
      },
    });

    const shouldBeDefault = existingCount === 0 || data.isDefault === true;

    if (shouldBeDefault) {
      await tx.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return tx.address.create({
      data: {
        userId,
        label: data.label,
        name: data.name,
        phone: data.phone,
        addressLine: data.addressLine,
        area: data.area ?? null,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        isDefault: shouldBeDefault,
      },
    });
  });
}

export async function getAddressById(userId: string, addressId: string) {
  return prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });
}

export async function updateAddress(
  userId: string,
  addressId: string,
  data: UpdateAddressInput,
) {
  return prisma.$transaction(async (tx) => {
    const address = await tx.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new Error("Address not found");
    }

    if (data.isDefault === true) {
      await tx.address.updateMany({
        where: {
          userId,
          isDefault: true,
          NOT: {
            id: addressId,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    return tx.address.update({
      where: {
        id: addressId,
      },
      data: {
        ...(data.label !== undefined && {
          label: data.label,
        }),
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.phone !== undefined && {
          phone: data.phone,
        }),
        ...(data.addressLine !== undefined && {
          addressLine: data.addressLine,
        }),
        ...(data.area !== undefined && {
          area: data.area,
        }),
        ...(data.city !== undefined && {
          city: data.city,
        }),
        ...(data.state !== undefined && {
          state: data.state,
        }),
        ...(data.pincode !== undefined && {
          pincode: data.pincode,
        }),
        ...(data.latitude !== undefined && {
          latitude: data.latitude,
        }),
        ...(data.longitude !== undefined && {
          longitude: data.longitude,
        }),
        ...(data.isDefault !== undefined && {
          isDefault: data.isDefault,
        }),
      },
    });
  });
}

export async function deleteAddress(userId: string, addressId: string) {
  return prisma.$transaction(async (tx) => {
    const address = await tx.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new Error("Address not found");
    }

    await tx.address.delete({
      where: {
        id: addressId,
      },
    });

    if (address.isDefault) {
      const nextAddress = await tx.address.findFirst({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (nextAddress) {
        await tx.address.update({
          where: {
            id: nextAddress.id,
          },
          data: {
            isDefault: true,
          },
        });
      }
    }

    return address;
  });
}
