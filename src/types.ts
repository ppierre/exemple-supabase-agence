/** schéma des informations d'un logment
 * TODO: https://schema.org/Apartment ou https://schema.org/Accommodation ?
 */
export interface SchemaOffreMaison {
  id: string; //TODO type uuid
  /** nom du logement */
  nom: string;
  prix: number;
  favori: boolean;
  image: string;
  image_name: string;
  /** nombre de lits du logement */
  nbrLits: number;
  /** nombre de salle de bain du logement */
  nbrSDB: number;
  adresse: PostalAddress;
  /** Surface habitable TODO: https://schema.org/floorSize ? */
  surface: string;
}

/**
 * https://schema.org/PostalAddress
 */
export interface PostalAddress {
  /** The country. For example, USA. You can also provide the two-letter ISO 3166-1 alpha-2 country code.  */
  addressCountry: string;
  /** The locality in which the street address is, and which is in the region. For example, Mountain View.  */
  addressLocality: string;
  addressRegion: string;
  postOfficeBoxNumber: string;
  postalCode: string;
  streetAddress: string;
}

export type PartialSchemaOffreMaison = Omit<
  Partial<SchemaOffreMaison>,
  "adresse"
> & {
  adresse?: Partial<PostalAddress>;
};
