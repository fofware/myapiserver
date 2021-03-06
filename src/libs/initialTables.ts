import lista from "../models/tipoLista";
import roles from "../models/roles";
import tags from "../models/tags";
import formaPago from "../models/formaPago";

export const createRoles = async () => {
  try {
    const count = await roles.estimatedDocumentCount();
    if (count > 0) return;
    const values = await Promise.all([
      new roles({name: "user"}).save(),
      new roles({name: 'cliente'}).save(),
      new roles({name: 'revendedor'}).save(),
      new roles({name: "empleado"}),
      new roles({name: "admin"}).save()
    ])
    console.log(values);
  } catch (error) {
    console.log(error);
  }
}

export const createTags = async () => {
  try {
//    await tags.deleteMany({});
    const count = await tags.estimatedDocumentCount();
    if (count > 0) return;
    const values = await Promise.all([
      new tags({name: "alimento"}).save(),
      new tags({name: 'balanceado'}).save(),
      new tags({name: 'humedo'}).save(),
      new tags({name: 'húmedo'}).save(),
      new tags({name: 'perro'}).save(),
      new tags({name: "cachorro"}).save(),
      new tags({name: "gatito"}).save(),
      new tags({name: "kitten"}).save(),
      new tags({name: "puppy"}).save(),
      new tags({name: "adulto"}).save(),
      new tags({name: "senior"}).save(),
      new tags({name: "cerdo"}).save(),
      new tags({name: "conejo"}).save(),
      new tags({name: "ave"}).save(),
      new tags({name: "semilla"}).save(),
      new tags({name: "sanitario"}).save(),
      new tags({name: "accesrio"}).save(),
      new tags({name: "juguete"}).save()
    ])
    console.log(values);
  } catch (error) {
    console.log(error);
  }
}

export const createTipoLista = async () => {
  try {
    //await lista.deleteMany({});
    const count = await lista.estimatedDocumentCount();
    if (count > 0) return;
    const values = await Promise.all([
      new lista({ name: 'Público', basePrecio: 'reposicion', value: 1, margen: true }).save(),
      new lista({ name: 'Cliente', basePrecio: 'reposicion', value: .965, margen: true }).save(),
      new lista({ name: 'Revendedor1', basePrecio: 'promedio', value: 1.13, margen: false }).save(),
      new lista({ name: 'Revendedor2', basePrecio: 'promedio', value: 1.10, margen: false }).save(),
      new lista({ name: 'Revendedor3', basePrecio: 'promedio', value: 1.05, margen: false }).save(),
    ])
    console.log(values);
  } catch (error) {
    console.log(error);
  }
}

export const createFormaPago = async () => {
  try {
    //await formaPago.deleteMany({});
    const count = await formaPago.estimatedDocumentCount();
    if (count > 0) return;
    const values = await Promise.all([
      new formaPago({ name: 'Efectivo', value: 0.965}).save(),
      new formaPago({ name: 'QR', value: 0.96570059}).save(),
      new formaPago({ name: 'Lista', value: 1 }).save(),
      new formaPago({ name: 'Especial', value: 0.9311 }).save(),
      new formaPago({ name: 'Trj. Débito', value: 1 }).save(),
      new formaPago({ name: 'Trj. Crédito 1 Pago', value: 1.034109}).save(),
      new formaPago({ name: 'Trj. Crédito 3 Pagos', value: 1.195802}).save(),
      new formaPago({ name: 'Trj. Crédito 6 Pagos', value: 1.364909}).save(),
    ])
    console.log(values);
  } catch (error) {
    console.log(error);
  }
}
export const initTables = async () => {
  const values = await Promise.all([
    createTags(),
    createRoles(),
    createTipoLista(),
    createFormaPago()
  ])
}