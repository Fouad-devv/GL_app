package com.gmpp.maintenance.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String BEARER_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI maintenanceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("GL Maintenance API")
                        .version("1.0.0")
                        .description("""
                                API REST pour la gestion de maintenance industrielle — GL Project.

                                **Authentification** : Toutes les routes nécessitent un token JWT Keycloak.
                                Obtenez un token via `POST /realms/JL_Project/protocol/openid-connect/token`
                                sur le serveur Keycloak, puis collez-le dans le bouton **Authorize** ci-dessus.
                                """)
                        .contact(new Contact()
                                .name("GL Project Team")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME))
                .components(new Components()
                        .addSecuritySchemes(BEARER_SCHEME, new SecurityScheme()
                                .name(BEARER_SCHEME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Token JWT obtenu depuis Keycloak — coller la valeur sans le préfixe 'Bearer '")));
    }
}
