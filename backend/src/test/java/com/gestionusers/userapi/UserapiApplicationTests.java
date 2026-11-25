package com.gestionusers.userapi;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// Nécessite MySQL + variables DB_PASSWORD / JWT_SECRET : à lancer manuellement.
@Disabled("Test d'intégration : nécessite une base MySQL et les variables d'environnement")
@SpringBootTest
class UserapiApplicationTests {

	@Test
	void contextLoads() {
	}

}
